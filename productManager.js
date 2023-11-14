const fs = require('fs');
class ProductManager {
    constructor() {
        this.path = "archivo.txt";
        this.nextId = 1;
    }
    async addProduct(product) {
        const products = await this.getProducts();
        const {
            title = "",
            description = "",
            price = 0,
            thumbnail = null,
            code = "",
            stock = 0
        } = product;
        if (title && description && price && thumbnail && code && stock) {
            if (!products.some((p) => p.code === code)) {
                products.push({
                    id: this.nextId++,
                    ...product,
                });
                const archivo = JSON.stringify(products, null, 2);
                await fs.promises.writeFile(this.path, archivo);
            } else {
                console.log("El código del producto ya existe.");
            }
        } else {
            console.log("Todos los campos ingresados son obligatorios.");
        }
    }
    async getProducts() {
        try {
            const archivo = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(archivo);
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const productoId = products.find((p) => p.id == id)
        if (productoId) {
            return productoId;
        } else {
            return "Not found";
        }
    }
    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const existingProduct = products.find((p) => p.id == id);
        if (existingProduct) {
            Object.assign(existingProduct, updatedFields);

            const archivo = JSON.stringify(products, null, 2);
            await fs.promises.writeFile(this.path, archivo);
        } else {
            console.log("Producto no encontrado.");
        }
    }
    async deleteProduct(id) {
        const products = await this.getProducts();
        const newProducts = products.filter((p) => p.id !== id);
        if (newProducts.length < products.length) {
            const archivo = JSON.stringify(newProducts, null, 2);
            await fs.promises.writeFile(this.path, archivo);
        } else {
            console.log("Producto no encontrado.");
        }
    }
}

async function main() {
    const products = new ProductManager();
    await products.addProduct({
        title: "producto1",
        description: "descripcion1",
        price: 10,
        thumbnail: "url1",
        code: 1244,
        stock: 22,
    });
    await products.addProduct({
        title: "producto2",
        description: "descripcion3",
        price: 14,
        thumbnail: "url3",
        code: 1255,
        stock: 25,
    });
    await products.addProduct({
        title: "producto3",
        description: "descripcion2",
        price: 13,
        thumbnail: "url2",
        code: 1244,
        stock: 20, // Código repetido
    });
    await products.addProduct({
        title: "producto4",
        description: "",
        price: 16,
        thumbnail: "",
        code: 1299,
        stock: 21, // Faltan datos
    });

    console.log(await products.getProducts()); // Debe mostrar 2 productos
    console.log(await products.getProductById(1)); // Producto con id 1
    console.log(await products.getProductById(3)); // Not found

    // Actualizar el producto con id 1
    await products.updateProduct(1, {
        price: 15,
        stock: 30,
    });
    // Actualizar el producto con id 2
    await products.updateProduct(2, {
        description: "Nueva descripción",
    });
    console.log("\nProductos después de la actualización:");
    console.log(await products.getProducts());

    // Producto no encontrado.
    await products.updateProduct(3, {
        title: "Intento fallido",
    });

    // Eliminar el producto con id 1
    await products.deleteProduct(1);
    console.log("\nProductos después de la eliminación:");
    console.log(await products.getProducts());

    // Producto no encontrado.
    await products.deleteProduct(3);
}

main();