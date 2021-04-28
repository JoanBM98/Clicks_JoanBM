const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: { origin: "*" },
});
const cors = require("cors");
app.use(cors());

app.use(express.static("public"));

let usersConnected = 0;
let numClicks = 0;

// escuchar conexiones
io.on("connection", (socket) => {
    usersConnected++;
    console.log('a user connected');
    // escuchar mensaje
    socket.on("message", (message) => {
        io.emit("message", {
            username: socket.username,
            message: message,
        });
    });

    // evento para saber quien es el username del socket abierto y emite el
    // username y usersConnected
    socket.on("iam", (username) => {
        socket.broadcast.emit("usuario conectado", {
            username,
            usersConnected,
        });
        socket.username = username;
        socket.emit("numero de usuarios", {
            usersConnected,
            numClicks,
        });
    });

    socket.on("click", () => {
        numClicks++;
        io.emit("new click", {
            numClicks,
            usersConnected
        });
    });

    socket.on("Reiniciar", () => {
        numClicks=0;
        numeroUsuario=0;
        io.emit("new Reiniciar", {
            numClicks,
            numeroUsuario,
        });
    });

    // detecta la desconexión y emite un evento al cliente con el username desconectado
    socket.on("disconnect", () => {
        usersConnected--;
        socket.broadcast.emit("usuario desconectado", {
            username: socket.username,
            usersConnected: usersConnected,
        });
    });
});

const port = process.env.PORT || 3000;

http.listen(port);
