const CustomError = require('../../utils/error/customErrors.js');
const { enumActionsErrors } = require('../../utils/error/enumActionsErrors.js');
const { enumErrors } = require('../../utils/error/errorEnum.js');
const { generateUserErrorInfo } = require('../../utils/error/generateInfoError.js');
const { usersModel } = require('./models/user.model.js');
const { ObjectId } = require('mongoose').Types;

class UserDaoMongo {
    constructor() {
        this.model = usersModel;
    }
    async get(limit = 10, page = 1,filter = {}) {
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
        };

        const { docs: payload, ...rest } = await this.model.paginate(filter, options);

        if (payload.length > 0) {
            const payloadWithoutPassword = payload.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            return {
                status: "success",
                payload:payloadWithoutPassword,
                ...rest,
                prevLink: rest.hasPrevPage ? `/user?limit=${limit}&page=${rest.prevPage}` : null,
                nextLink: rest.hasNextPage ? `/user?limit=${limit}&page=${rest.nextPage}` : null,
            };
        } else {
            CustomError.createError({
                name:"USER ERROR",
                code:enumErrors.DATABASE_ERROR,
                message:generateProductErrorInfo(payload,enumActionsErrors.ERROR_GET),
                cause:'No hay usuarios disponibles',
            })
        }
    }
    async getBy(filter,notPassword) {
        let user
        if(notPassword){
            user= await this.model.findOne(filter).select('-password').lean();
        }else{
            user= await this.model.findOne(filter).lean();
        }
        if (user) {
            return { status: "success", payload: user };
        } else {
            CustomError.createError({
                name:"USER ERROR",
                code:enumErrors.DATABASE_ERROR,
                message:generateUserErrorInfo(user,enumActionsErrors.ERROR_GET),
                cause:'Usuario no encontrado',
            })
        }
    }
    async exists(filter) {
        return await this.model.exists(filter).lean(); 
    }
    async create(newUser) {
        return await this.model.create(newUser)
    }
    async update(uid,userUpdate) {
        const existingUser = await this.model.findOne({ _id: new ObjectId(uid) });

        if (existingUser) {
            if (userUpdate.id && userUpdate.id !== uid.toString()) {
                throw new Error("No se permite modificar el campo 'id'")
            }
            const allowedProperties = ['first_name', 'last_name', 'email', 'birthdate', 'password', 'role'];

            const sanitizedUser = Object.keys(userUpdate)
                .filter(key => allowedProperties.includes(key))
                .reduce((obj, key) => {
                    obj[key] = userUpdate[key];
                    return obj;
                }, {});
            const result = await this.model.updateOne({ _id: new ObjectId(uid) }, sanitizedUser);
            if (result.modifiedCount > 0) {
                return { status: "success", message: 'Usuario actualizado correctamente' };
            } else {
                throw new Error('Ningún cambio realizado en el Usuario')
            }
        } else {
            throw new Error('Usuario no encontrado')
        }
    }
    async delete(uid) {
        const UserDelete = await this.model.findOneAndDelete({ _id: uid }).lean()
        if (UserDelete) {
            return { status: "success", message: 'Usuario eliminado correctamente', payload:UserDelete }
        } else {
            throw new Error('Usuario no encontrado')
        }
    }
}

exports.UserMongo = UserDaoMongo;