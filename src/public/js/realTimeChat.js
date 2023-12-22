const socket = io()
let user 
let chatBox = document.querySelector('#chatBox')



Swal.fire({
    title: 'Ingrese su correo',
    input: 'text',
    allowOutsideClick: false,
    inputValidator: value => {
        return !value && 'Necesitas escribir un correo para continuar!!'     
    }
}).then(result => {
    user = result.value
})

chatBox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        if(chatBox.value.trim().length > 0){
            socket.emit('message', {user ,message: chatBox.value})
            chatBox.value = ''
        }
    }
})

socket.on('messageLogs', data => {
    let messageLogs = document.querySelector('#messageLogs') 
    let messages    = ''
    
    data.forEach(elementMensajes => {
        messages += `
            ${elementMensajes.user} dice: ${elementMensajes.message}<br>
        `
    })
    messageLogs.innerHTML = messages
})