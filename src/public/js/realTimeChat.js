const socket = io();
let user;
let chatBox = document.querySelector('#chatBox');

socket.on('connect', () => {
    console.log('Conexión establecida');
});

Swal.fire({
    title: 'Ingrese su correo',
    input: 'text',
    allowOutsideClick: false,
    inputValidator: (value) => {
        if (!value || !isValidEmail(value)) {
            return 'Por favor, ingrese un correo electrónico válido';
        }
    },
}).then((result) => {
    if (result.isConfirmed) {
        user = result.value;
        socket.emit('messageLogs');

        chatBox.addEventListener('keyup',async (evt) => {
            if (evt.key === 'Enter') {
                if (chatBox.value.trim().length > 0) {
                    socket.emit('message', { user: user, message: chatBox.value });
                    chatBox.value = '';
                }
            }
        });

        socket.on('messageLogs', async (data) => {
            try {
                let messageLogs = document.querySelector('#messageLogs');
                messageLogs.innerHTML = '';

                data.forEach((messages) => {
                    const p = document.createElement('p');
                    p.innerHTML = `${messages.user} dice: ${messages.message}`;
                    messageLogs.appendChild(p);
                });
            } catch (error) {
                console.error('Error al procesar mensajes:', error);
            }
        });
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function deleteAllMessages(){
    socket.emit('deleteAllMessages')
}
