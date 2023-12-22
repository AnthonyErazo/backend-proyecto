const { ObjectId } = require('mongoose').Types;
const { productModel } = require('./models/products.model');

class ProductDaoMongo {
    constructor() {
        this.model = productModel;
    }

    async getProducts() {
        try {
            const products = await this.model.find({}).lean();

            if (products.length > 0) {
                return { success: true, data: products };
            } else {
                return { success: false, message: 'No hay productos disponibles' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al obtener los productos', error: error.message  };
        }
    };

    async getProductById(pid) {
        try {
            const product = await this.model.findOne({ _id: new ObjectId(pid) });

            if (product) {
                return { success: true, data: product };
            } else {
                return { success: false, message: 'Producto no encontrado' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al obtener el producto', error: error.message  };
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
    
        try {
            if (!(title && description && price && status && code && stock && category)) {
                return { success: false, message: "Todos los campos ingresados son obligatorios." };
            }
            const newProduct = await this.model.create(product);
    
            return { success: true, data: newProduct };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al agregar el producto', error: error.message };
        }
    };

    async updateProduct(pid, updatedFields) {
        try {
            const existingProduct = await this.model.findOne({ _id: new ObjectId(pid) });

            if (existingProduct) {
                if (updatedFields.id && updatedFields.id !== pid.toString()) {
                    throw new Error("No se permite modificar el campo 'id'");
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
                    return { success: true, message: 'Producto actualizado correctamente' };
                } else {
                    return { success: false, message: 'Ningún cambio realizado en el producto' };
                }
            } else {
                return { success: false, message: 'Producto no encontrado' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al actualizar el producto', error: error.message  };
        };
    };

    async deleteProduct(pid) {
        try {
            const existingProduct = await this.model.findOne({ _id: new ObjectId(pid) });
    
            if (existingProduct) {
                const result = await this.model.deleteOne({ _id: new ObjectId(pid) });
    
                if (result.deletedCount > 0) {
                    return { success: true, message: 'Producto eliminado correctamente' };
                } else {
                    return { success: false, message: 'Ningún producto eliminado' };
                }
            } else {
                return { success: false, message: 'Producto no encontrado' };
            }
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al eliminar el producto', error: error.message  };
        }
    }
    

    async getProductsDetails(productQuantities) {
        try {
            const productIds = productQuantities.map(({ id }) => new ObjectId(id));
    
            const products = await this.model.find({ _id: { $in: productIds } }).lean();
    
            const details = productQuantities.map(({ id, quantity }) => {
                const product = products.find((p) => p._id.toString() === id);
                return product ? { ...product, quantity } : null;
            });
    
            return { success: true, data: details.filter((product) => product !== null) };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error al obtener detalles de productos', error: error.message };
        }
    }
    
}

exports.ProductMongo = ProductDaoMongo;