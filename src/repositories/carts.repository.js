class CartRepository {
    constructor(dao){
        this.dao = dao
    }

    createNewCart             = async () => await this.dao.create()
    getProductsByCartId       = async (cid) => await this.dao.getProductsBy(cid)
    addProductByCartId        = async (cid, pid,quantityProduct) => await this.dao.addProductBy(cid, pid,quantityProduct)
    removeProductByCartId     = async (cid, pid) => await this.dao.removeProductBy(cid, pid)
    removeAllProductsByCartId = async (cid) => await this.dao.removeAllProductsBy(cid)
    updateProductQuantity     = async (cid, pid, newQuantity) => await this.dao.updateProductQuantity(cid, pid, newQuantity)
    updateProductsInCart      = async (cid, updatedProducts) => await this.dao.updateProductsInCart(cid, updatedProducts)
    deleteCart                = async (cid) => await this.dao.deleteCart(cid)

}

module.exports = CartRepository