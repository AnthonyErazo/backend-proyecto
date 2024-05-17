const socket = io();
let user;
let chatBox = document.querySelector("#chatBox");

var userName = userData.userName;
var userEmail = userData.email;

socket.on("connect", () => {
    console.log("Conexión establecida");
});
socket.emit("messageLogs");

chatBox.addEventListener("keyup", async (evt) => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", { user: userEmail, message: chatBox.value });
            chatBox.value = "";
        }
    }
});

socket.on("messageLogs", async (data) => {
    try {
        let messageLogs = document.querySelector("#messageLogs");
        messageLogs.innerHTML = "";

        data.forEach((messages) => {
            const p = document.createElement("p");
            p.innerHTML = `${messages.user} dice: ${messages.message}`;
            messageLogs.appendChild(p);
        });
    } catch (error) {
        console.error("Error al procesar mensajes:", error);
    }
});
function deleteAllMessages() {
    socket.emit("deleteAllMessages");
}
