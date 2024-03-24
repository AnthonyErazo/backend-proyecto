class ProductsRepository {
    constructor(dao){
        this.dao = dao
    }

    getProducts   = async (limit,page,sort,query,term) => await this.dao.get(limit,page,sort,query,term)
    getProduct    = async (filter) => await this.dao.getBy(filter)
    createProduct = async (newProduct,owner) => await this.dao.create(newProduct,owner)
    updateProduct = async (pid, productToUpdate) => await this.dao.update(pid, productToUpdate)
    deleteProduct = async (pid,idUser) => await this.dao.delete(pid,idUser)
    isProductOwnedByUser=async (prdductId,idUser)=>await this.dao.isProductOwnedByUser(prdductId,idUser)

}

module.exports = ProductsRepository