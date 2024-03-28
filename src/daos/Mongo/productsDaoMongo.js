const { productModel } = require('./models/products.model');
const CustomError = require('../../utils/error/customErrors');
const { enumErrors } = require('../../utils/error/errorEnum');
const { generateProductErrorInfo } = require('../../utils/error/generateInfoError');
const { enumActionsErrors } = require('../../utils/error/enumActionsErrors');

class ProductDaoMongo {
    constructor() {
        this.model = productModel;
    }

    async get(limit = 10, page = 1, sort, query, term) {

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
        };



        if (sort) {
            const parsedSort = parseInt(sort);
            if (![1, -1].includes(parsedSort)) {
                CustomError.createError({
                    name: "PRODUCT ERROR",
                    code: enumErrors.INVALID_TYPES_ERROR,
                    message: generateProductErrorInfo(1, enumActionsErrors.ERROR_GET),
                    cause: "El parámetro sort debe ser 1 o -1",
                })
            }
            options.sort = { price: parsedSort };
        }

        let parsedQuery = {};
        if (query) {
            try {
                parsedQuery = JSON.parse(query);
            } catch (error) {
                CustomError.createError({
                    name: "PRODUCT ERROR",
                    code: enumErrors.INVALID_TYPES_ERROR,
                    message: generateProductErrorInfo(1, enumActionsErrors.ERROR_GET),
                    cause: "Error al analizar el parámetro de consulta JSON",
                })
            }
        }
        if (term) {
            const regex = new RegExp(term, 'i');
            parsedQuery.title = { $regex: regex };
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
            let cause = "No hay productos disponibles"
            if (term) {
                cause = `No se encontraron resultados para '${term}'`
            }
            CustomError.createError({
                name: "PRODUCT ERROR",
                code: enumErrors.DATABASE_ERROR,
                message: generateProductErrorInfo(payload, enumActionsErrors.ERROR_GET),
                cause,
            })
        }
    };

    async getBy(filter) {
        const product = await this.model.findOne({ status: true, ...filter }).lean();

        if (product) {
            return { status: "success", payload: product };
        } else {
            CustomError.createError({
                name: "PRODUCT ERROR",
                code: enumErrors.DATABASE_ERROR,
                message: generateProductErrorInfo(product, enumActionsErrors.ERROR_GET),
                cause: "No hay productos disponibles",
            })
        }

    };
    async create(product) {
        const {
            title = "",
            description = "",
            price = 0,
            thumbnail = [],
            code = "",
            stock = 0,
            status = true,
            category = "",
            owner = 'admin'
        } = product;

        if (!(title && description && price && code && stock && category && owner)) {
            CustomError.createError({
                name: "PRODUCT ERROR",
                code: enumErrors.INVALID_TYPES_ERROR,
                message: generateProductErrorInfo(product, enumActionsErrors.ERROR_ADD),
                cause: "Todos los campos ingresados son obligatorios.",
            })
        }
        const newProduct = await this.model.create(product);

        return { status: "success", payload: newProduct };

    };

    async update(pid, updatedFields) {

        const existingProduct = await this.model.findOne({ _id: pid });

        if (existingProduct) {
            if (updatedFields.id && updatedFields.id !== pid.toString()) {
                CustomError.createError({
                    name: "PRODUCT ERROR",
                    code: enumErrors.INVALID_TYPES_ERROR,
                    message: generateProductErrorInfo(existingProduct, enumActionsErrors.ERROR_UPDATE),
                    cause: "No se permite modificar el campo 'id'",
                })
            }
            const allowedProperties = ['title', 'description', 'price', 'thumbnail', 'code', 'stock', 'status', 'category'];

            const sanitizedProduct = Object.keys(updatedFields)
                .filter(key => allowedProperties.includes(key))
                .reduce((obj, key) => {
                    obj[key] = updatedFields[key];
                    return obj;
                }, {});
            const result = await this.model.updateOne({ _id: pid }, sanitizedProduct);
            if (result.modifiedCount > 0) {
                return { status: "success", message: 'Producto actualizado correctamente' };
            } else {
                CustomError.createError({
                    name: "PRODUCT ERROR",
                    code: enumErrors.DATABASE_ERROR,
                    message: generateProductErrorInfo(existingProduct, enumActionsErrors.ERROR_UPDATE),
                    cause: "Ningún cambio realizado en el producto",
                })
            }
        } else {
            CustomError.createError({
                name: "PRODUCT ERROR",
                code: enumErrors.DATABASE_ERROR,
                message: generateProductErrorInfo(existingProduct, enumActionsErrors.ERROR_UPDATE),
                cause: "Producto no encontrado",
            })
        }

    };

    async delete(pid, idUser) {
        let ProductDelete
        if (!idUser) {
            CustomError.createError({
                name: "PRODUCT ERROR",
                code: enumErrors.INVALID_TYPES_ERROR,
                message: 'Error al eliminar producto',
                cause: "Error al buscar el usuario por id",
            })
        }
        if (idUser == 'admin') {
            ProductDelete = await this.model.findOneAndDelete({ _id: pid }).lean()
        } else {
            ProductDelete = await this.model.findOneAndDelete({ _id: pid, owner: idUser }).lean()
        }
        if (ProductDelete) {
            return { status: "success", message: 'Producto eliminado correctamente', payload: ProductDelete }
        } else {
            CustomError.createError({
                name: "PRODUCT ERROR",
                code: enumErrors.DATABASE_ERROR,
                message: generateProductErrorInfo(ProductDelete, enumActionsErrors.ERROR_DELETE),
                cause: "Producto no encontrado",
            })
        }

    }
    async isProductOwnedByUser(productId, idUser) {
        const product = await this.model.findOne({ _id: productId}).lean();
        if(product.owner===idUser){
            CustomError.createError({
                name: "PRODUCT ERROR",
                code: enumErrors.INVALID_OPERATION_ERROR,
                message: "No puedes realizar esta acción en este producto",
                cause: "El producto no puede ser propiedad del usuario que intenta realizar la acción",
            });
        }
    }
    
}

exports.ProductMongo = ProductDaoMongo;