const fs = require('fs');
class ProductManager {
    constructor() {
        this.path = "archivo.txt";
    }
    async addProduct(product) {
        const {
            title = "",
            description = "",
            price = 0,
            thumbnail = null,
            code = "",
            stock = 0
        } = product;
        if (!(title && description && price && thumbnail && code && stock)) {
            console.log("Todos los campos ingresados son obligatorios.");
            return;
        }

        const { currentId, products } = await this.getProductsFromFile();
        const id = currentId + 1;

        if (products.some((p) => p.code === code)) {
            console.log("El código del producto ya existe.");
            return;
        }

        products.push({ id, ...product });
        await this.saveProductsToFile(products);
    }
    async getProductsFromFile() {
        try {
            const archivo = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(archivo) || { currentId: 0, products: [] };
        } catch (error) {
            return { currentId: 0, products: [] };
        }
    }
    async getProducts() {
        try {
            const archivo = await fs.promises.readFile(this.path, 'utf-8');
            const data= JSON.parse(archivo);
            return data.products||[];
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const productoId = products.find((p) => p.id == id)
        return productoId || "Not found";
    }
    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const existingProductIndex = products.findIndex((p) => p.id == id);
        if (existingProductIndex!==-1) {
            products[existingProductIndex] = { ...products[existingProductIndex], ...updatedFields };

            await this.saveProductsToFile(products);
        } else {
            console.log("Producto no encontrado.");
        }
    }
    async deleteProduct(id) {
        const products = await this.getProducts();
        const newProducts = products.filter((p) => p.id !== id);
        if (newProducts.length < products.length) {
            await this.saveProductsToFile(newProducts);
        } else {
            console.log("Producto no encontrado.");
        }
    }
    async saveProductsToFile(products) {
        const data = {
            currentId: products.length > 0 ? products[products.length - 1].id : 0,
            products: products,
        };
        const archivo = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(this.path, archivo);
    }
}

module.exports=ProductManager;