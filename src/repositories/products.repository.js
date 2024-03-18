class ProductsRepository {
    constructor(dao){
        this.dao = dao
    }

    getProducts   = async (limit,page,sort,query,term) => await this.dao.get(limit,page,sort,query,term)
    getProduct    = async (filter) => await this.dao.getBy(filter)
    createProduct = async (newProduct) => await this.dao.create(newProduct)
    updateProduct = async (pid, productToUpdate) => await this.dao.update(pid, productToUpdate)
    deleteProduct = async (pid) => await this.dao.delete(pid)

}

module.exports = ProductsRepository