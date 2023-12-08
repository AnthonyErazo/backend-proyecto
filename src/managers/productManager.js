const fs = require('fs');
const path = 'src/mockDB/productos.json'
class ProductManager {
    constructor() {
        this.path = path;
    }
    async addProduct(product) {
        const {
            title = "",
            description = "",
            price = 0,
            thumbnail = [],
            code = "",
            stock = 0,
            status = true,
            category = ""
        } = product;
        if (!(title && description && price && status && code && stock && category)) {
            throw new Error("Todos los campos ingresados son obligatorios.");
        }
        const { currentId, products } = await this.getProductsFromFile();
        const newProductId = currentId ? currentId + 1 : 1;
        if (products.some((p) => p.code === code)) {
            throw new Error("El código del producto ya existe.");
        }

        products.push({ id: `${newProductId}`, ...product });
        await this.saveProductsToFile(products, newProductId);

        return { currentId, products }
    }
    async getProductsFromFile() {
        try {
            const file = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(file) || { currentId: 0, products: [] };
        } catch (error) {
            return { currentId: 0, products: [] };
        }
    }
    async getProducts() {
        const { products } = await this.getProductsFromFile();
        return products;
    }

    async getProductById(id) {
        const { products } = await this.getProductsFromFile();
        const product = products.find((p) => p.id === id)
        return product ? product : null;
    }
    async updateProduct(id, updatedFields) {
        const { currentId, products } = await this.getProductsFromFile();
        const existingProductIndex = products.findIndex((p) => p.id === id);
        if (existingProductIndex !== -1) {
            if (updatedFields.id && updatedFields.id !== id) {
                throw new Error("No se permite modificar el campo 'id' ");
            }
            const updatedProduct = { ...products[existingProductIndex], ...updatedFields };

            const allowedProperties = ['id','title', 'description', 'price', 'thumbnail', 'code', 'stock', 'status', 'category'];
            const sanitizedProduct = Object.keys(updatedProduct)
                .filter(key => allowedProperties.includes(key))
                .reduce((obj, key) => {
                    obj[key] = updatedProduct[key];
                    return obj;
                }, {});

            products[existingProductIndex] = sanitizedProduct;
            await this.saveProductsToFile(products, currentId);
            return { currentId, products };
        } else {
            throw new Error("Producto no encontrado.");
        }
    }
    async deleteProduct(id) {
        const { currentId, products } = await this.getProductsFromFile();
        const newProducts = products.filter((p) => parseInt(p.id) !== parseInt(id));
        if (newProducts.length < products.length) {
            await this.saveProductsToFile(newProducts, currentId);
            return { currentId, newProducts }
        } else {
            throw new Error("Producto no encontrado.");
        }
    }
    async saveProductsToFile(products, currentId) {
        const data = {
            currentId: currentId,
            products: products,
        };
        const file = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(this.path, file);
    }
    async getProductsDetails(productQuantities) {
        const { products } = await this.getProductsFromFile();
        const details = productQuantities.map(({ id, quantity }) => {
            const product = products.find((p) => p.id === id);
            return product ? { ...product, quantity } : null;
        });

        return details.filter((product) => product !== null);
    }
}

module.exports = ProductManager;