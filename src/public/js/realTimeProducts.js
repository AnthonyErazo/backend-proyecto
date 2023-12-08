const socket = io()
socket.on('connect', () => {
    console.log('Conexión establecida')
})

socket.on('newProducts',async (products) => {
    try {
        const tableProducts = document.getElementById('tableProducts')
        tableProducts.innerHTML = ''

        products.forEach((product) => {
            const row = document.createElement('tr')
            row.innerHTML = `
            <td>${product.title}</td>
            <td>$${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.description}</td>
            <td>
                <button onclick="deleteProduct(${product.id})">Borrar</button>
            </td>
            `
            tableProducts.appendChild(row)
        })
    } catch (error) {
        console.error('Error al procesar productos:', error)
    }
})

function addProduct() {
    const form = document.getElementById('addProductForm')
    const title = form.elements.title.value
    const description = form.elements.description.value
    const price = form.elements.price.value
    const thumbnail = ['','']
    const code = form.elements.code.value
    const stock = form.elements.stock.value
    const category = form.elements.category.value

    socket.emit('addProduct', { code, title, description, price, stock, thumbnail, category })

    form.reset()
}

function deleteProduct(id) {
    socket.emit('eliminateProduct', id)
}