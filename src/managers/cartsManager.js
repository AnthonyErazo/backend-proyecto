const fs = require('fs');
const path='src/mockDB/carrito.json'
class CartManager{
    constructor(){
        this.path = path;
    }
    async createNewCart() {
        const { currentId, carts } = await this.getCartsFromFile();
        carts.push({ id:`${currentId+1}`, product:[] });
        await this.saveCartToFile(carts,currentId+1);
        return { id:`${currentId+1}`, product:[] }
    }
    async getCartsFromFile() {
        try {
            const file = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(file) || { currentId: 0, carts: [] };
        } catch (error) {
            return { currentId: 0, carts: [] };
        }
    }
    async getProductsByCartId(cid) {
        const { carts } = await this.getCartsFromFile();
        const cart = carts.find((c) => c.id === cid);
        return cart ? cart.product : null;
    }
    async addProductByCartId(cid,pid) {
        const { currentId, carts } = await this.getCartsFromFile();
        const existingCartIndex = carts.findIndex((c) => c.id ===cid);
        if (existingCartIndex!==-1) {
            const cart=carts[existingCartIndex];
            const existingProductIndex = cart.product.findIndex((p) => p.id === pid);
            if (existingProductIndex !== -1) {
                cart.product[existingProductIndex].quantity += 1;
            } else {
                cart.product.push({ id: pid, quantity: 1 });
            }
            carts[existingCartIndex] = cart;
            await this.saveCartToFile(carts,currentId);
        } else {
            console.log("Carrito no encontrado.");
        }
    }
    async saveCartToFile(carts,currentId) {
        const data = {
            currentId: currentId,
            carts: carts,
        };
        const file = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(this.path, file);
    }
}
module.exports = CartManager