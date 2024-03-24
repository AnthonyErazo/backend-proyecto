const socket = io()
socket.on('connect', () => {
    console.log('Conexión establecida')
})

socket.on('newProducts',async (products,idUser) => {
    try {
        const tableProducts = document.getElementById('tableProducts')
        tableProducts.innerHTML = ''

        products?.forEach((product) => {
            const row = document.createElement('tr')
            row.innerHTML = `
            <td>${product.title}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.description}</td>
            <td>
                <button onclick="deleteProduct('${product._id}','${idUser}')">Borrar</button>
            </td>
            `
            tableProducts.appendChild(row)
        })
    } catch (error) {
        console.error('Error al procesar productos:', error)
    }
})

function addProduct(idUser) {
    const form = document.getElementById('addProductForm')
    const title = form.elements.title.value
    const description = form.elements.description.value
    const price = form.elements.price.value
    const thumbnail = ['','']
    const code = form.elements.code.value
    const stock = form.elements.stock.value
    const category = form.elements.category.value
    const owner = idUser||'admin'

    socket.emit('addProduct', { code, title, description, price, stock, thumbnail, category,owner })

    form.reset()
}

function deleteProduct(id,idUser) {
    socket.emit('eliminateProduct', id,idUser)
}