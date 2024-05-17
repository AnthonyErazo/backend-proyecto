const password = document.querySelector('#password')
const pswRepeat = document.querySelector('#psw-repeat')
const sigInSubmit = document.querySelector('#sigInSubmit')
const answer = document.querySelector('#answer')

password.addEventListener('keyup', (e) => {
  if (password.value === pswRepeat.value && password.value.length >= 4) {
    sigInSubmit.disabled = false
    answer.innerHTML = ''
  } else {
    sigInSubmit.disabled = true
    answer.innerHTML = 'La contraseña debe tener una longitud mínima de 4 caracteres'
  }
})
pswRepeat.addEventListener('keyup', (e) => {
  if (password.value === pswRepeat.value && password.value.length >= 4 ) {
    sigInSubmit.removeAttribute('disabled')
    answer.innerHTML = ''
  } else {
    sigInSubmit.disabled = true;
    answer.innerHTML = 'La contraseña deben ser iguales'
  }
})
