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
                return { success: false, message: 'El parámetro sort debe ser 1 o -1' };
            }
            options.sort = { price: parsedSort };
        }

        let parsedQuery = {};
        if (query) {
            try {
                parsedQuery = JSON.parse(query);
            } catch (error) {
                return { status: "error", message: 'Error al analizar el parámetro de consulta JSON' };
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
            return { status: "error", message: 'No hay productos disponibles' };
        }
    };

    async getProductById(pid) {
        const product = await this.model.findOne({ _id: new ObjectId(pid) }).lean();

        if (product) {
            return { status: "success", payload: product };
        } else {
            return { status: "error", message: 'Producto no encontrado' };
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
            return { status: "error", message: "Todos los campos ingresados son obligatorios." };
        }
        const newProduct = await this.model.create(product);

        return { status: "success", payload: newProduct };

    };

    async updateProduct(pid, updatedFields) {

        const existingProduct = await this.model.findOne({ _id: new ObjectId(pid) });

        if (existingProduct) {
            if (updatedFields.id && updatedFields.id !== pid.toString()) {
                return { sstatus: "error", message: "No se permite modificar el campo 'id'" };
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
                return { status: "error", message: 'Ningún cambio realizado en el producto' };
            }
        } else {
            return { status: "error", message: 'Producto no encontrado' };
        }

    };

    async deleteProduct(pid) {
        const existingProduct = await this.model.findOne({ _id: new ObjectId(pid) });

        if (existingProduct) {
            const result = await this.model.deleteOne({ _id: new ObjectId(pid) });

            if (result.deletedCount > 0) {
                return { status: "success", message: 'Producto eliminado correctamente' };
            } else {
                return { status: "error", message: 'Ningún producto eliminado' };
            }
        } else {
            return { status: "error", message: 'Producto no encontrado' };
        }

    }
}

exports.ProductMongo = ProductDaoMongo;