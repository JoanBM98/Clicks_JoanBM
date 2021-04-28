let text = document.querySelector("#chat");
let sendButton = document.querySelector("#sendButton");
let sendButtonRestart = document.querySelector("#sendButtonRestart");
let textMessage = document.querySelector("#textMessage");

let usersConnected = document.getElementById("counter");
let numClicksText = document.getElementById("clicksTxt");
let numClicksTextUser = document.getElementById("clicksTxtUser");
let numClicksTextUserMedia = document.getElementById("clicksTxtUserMedia");
let MediaTxt = document.getElementById("MediaTxt");

let numeroUsuario= 0;

const urlParams = new URLSearchParams(window.location.search);

const socket = io();

socket.on("message", (data) => {
    const d = document.createElement("div");
    const t = document.createTextNode(data.username + ": " + data.message);
    d.appendChild(t);
    
});

socket.on("usuario conectado", (data) => {
    const d = document.createElement("div");
    d.classList.add("joined");
    const t = document.createTextNode(
        "El usuario " + data.username + " se ha conectado"
    );
    d.appendChild(t);
    

    usersConnected.innerText = data.usersConnected;
});

socket.on("usuario desconectado", (data) => {
    const d = document.createElement("div");
    d.classList.add("joined");
    const t = document.createTextNode(
        "El usuario " + data.username + " se ha desconectado!"
    );
    d.appendChild(t);
    
    usersConnected.innerText = data.usersConnected;
});

socket.on("connect", () => {
    socket.emit("iam", urlParams.get("user"));
});

socket.on("numero de usuarios", (data) => {
    usersConnected.innerText = data.usersConnected;
    numClicksText.innerHTML = data.numClicks;
});


socket.on("new click", (data) => {
    numClicksText.innerText = data.numClicks;
    var mediaClicks = data.numClicks/data.usersConnected

    numClicksTextUserMedia.innerText = mediaClicks

    if(mediaClicks == numeroUsuario ){
        MediaTxt.innerText = "Tu media es igual a la media global";

    }else if(mediaClicks > numeroUsuario ){
        MediaTxt.innerText = "Tu media se encuentra por debajo de la media global";
    }else{
        MediaTxt.innerText = "Tu media se encuentra por encima de la media global";
    }



});

sendButton.onclick = () => {
    numeroUsuario++;
    socket.emit("click", "");       
    numClicksTextUser.innerText=numeroUsuario;
    
};

socket.on("new Reiniciar", () => {
    numClicksText.innerText = 0;
});

sendButtonRestart.onclick = () => {
    socket.emit("Reiniciar", "");
    numClicksTextUser.innerText = 0;
    numClicksText.innerText = 0;
    numeroUsuario=0
};
