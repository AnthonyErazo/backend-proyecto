class ProductManager {
    constructor() {
        this.productos = [];
        this.nextId = 1;
    }
    addProduct(product) {
        const {
            title = "",
            description = "",
            price = 0,
            thumbnail = "",
            code = "",
            stock = 0
        } = product;
        if (title && description && price && thumbnail && code && stock) {
            if (!this.productos.some((p) => p.code === code)) {
                this.productos.push({
                    id: this.nextId++,
                    ...product,
                });
            } else {
                console.log("El código del producto ya existe.");
            }
        } else {
            console.log("Todos los campos ingresados son obligatorios.");
        }
    }
    getProducts() {
        return this.productos;
    }
    getProductById(id) {
        const productoId = this.productos.find((p) => p.id == id)
        if (productoId) {
            return productoId;
        } else {
            return "Not found";
        }
    }
}

const productos = new ProductManager();
productos.addProduct({
    title: "producto1",
    description: "descripcion1",
    price: 10,
    thumbnail: "url1",
    code: 1244,
    stock: 22,
});
productos.addProduct({
    title: "producto2",
    description: "descripcion3",
    price: 14,
    thumbnail: "url3",
    code: 1255,
    stock: 25,
});
productos.addProduct({
    title: "producto3",
    description: "descripcion2",
    price: 13,
    thumbnail: "url2",
    code: 1244,
    stock: 20, // Código repetido
});
productos.addProduct({
    title: "producto4",
    description: "",
    price: 16,
    thumbnail: "",
    code: 1299,
    stock: 21, // Faltan datos
});

console.log(productos.getProducts()); // Debe mostrar 2 productos
console.log(productos.getProductById(1)); // Producto con id 1
console.log(productos.getProductById(3)); // Not found