const { ObjectId } = require('mongoose').Types;
const { productModel } = require('./models/products.model');

class ProductDaoMongo {
    constructor() {
        this.model = productModel;
    }

    async getProducts(limit = 10, page = 1, sort, query) {

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
        };

        if (sort) {
            const parsedSort = parseInt(sort);
            if (![1, -1].includes(parsedSort)) {
                throw new Error('El parámetro sort debe ser 1 o -1');
            }
            options.sort = { price: parsedSort };
        }

        let parsedQuery = {};
        if (query) {
            try {
                parsedQuery = JSON.parse(query);
            } catch (error) {
                throw new Error('Error al analizar el parámetro de consulta JSON');
            }
        }

        const { docs: payload, ...rest } = await this.model.paginate(parsedQuery, options);

        if (payload.length > 0) {
            return {
                status: "success",
                payload,
                ...rest,
                prevLink: rest.hasPrevPage ? `/products?limit=${limit}&page=${rest.prevPage}` : null,
                nextLink: rest.hasNextPage ? `/products?limit=${limit}&page=${rest.nextPage}` : null,
            };
        } else {
            throw new Error('No hay productos disponibles');
        }
    };

    async getProductById(pid) {
        const product = await this.model.findOne({ _id: new ObjectId(pid) }).lean();

        if (product) {
            return { status: "success", payload: product };
        } else {
            throw new Error(`Producto con ID:${pid} no encontrado`)
        }

    };
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

        if (!(title && description && price && code && stock && category)) {
            throw new Error("Todos los campos ingresados son obligatorios.")
        }
        const newProduct = await this.model.create(product);

        return { status: "success", payload: newProduct };

    };

    async updateProduct(pid, updatedFields) {

        const existingProduct = await this.model.findOne({ _id: new ObjectId(pid) });

        if (existingProduct) {
            if (updatedFields.id && updatedFields.id !== pid.toString()) {
                throw new Error("No se permite modificar el campo 'id'")
            }
            const allowedProperties = ['id', 'title', 'description', 'price', 'thumbnail', 'code', 'stock', 'status', 'category'];

            const sanitizedProduct = Object.keys(updatedFields)
                .filter(key => allowedProperties.includes(key))
                .reduce((obj, key) => {
                    obj[key] = updatedFields[key];
                    return obj;
                }, {});
            const result = await this.model.updateOne({ _id: new ObjectId(pid) }, sanitizedProduct);

            if (result.nModified > 0) {
                return { status: "success", message: 'Producto actualizado correctamente' };
            } else {
                throw new Error('Ningún cambio realizado en el producto')
            }
        } else {
            throw new Error('Producto no encontrado')
        }

    };

    async deleteProduct(pid) {
        const existingProduct = await this.model.findOne({ _id: new ObjectId(pid) });

        if (existingProduct) {
            const result = await this.model.deleteOne({ _id: new ObjectId(pid) });

            if (result.deletedCount > 0) {
                return { status: "success", message: 'Producto eliminado correctamente' };
            } else {
                throw new Error('Ningún producto eliminado')
            }
        } else {
            throw new Error('Producto no encontrado')
        }

    }
}

exports.ProductMongo = ProductDaoMongo;