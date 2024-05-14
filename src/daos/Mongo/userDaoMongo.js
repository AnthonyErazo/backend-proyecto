const CustomError = require('../../utils/error/customErrors.js');
const { enumActionsErrors } = require('../../utils/error/enumActionsErrors.js');
const { enumErrors } = require('../../utils/error/errorEnum.js');
const { generateUserErrorInfo } = require('../../utils/error/generateInfoError.js');
const { usersModel } = require('./models/user.model.js');
const { ObjectId } = require('mongoose').Types;
const { sendMail } = require("../../utils/sendMail.js")

class UserDaoMongo {
    constructor() {
        this.model = usersModel;
    }
    async get(limit = 10, page = 1, filter = {}) {
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
        };
        let parsedQuery = {};
        if (filter) {
            try {
                parsedQuery = JSON.parse(filter);
            } catch (error) {
                CustomError.createError({
                    name: "USER ERROR",
                    code: enumErrors.INVALID_TYPES_ERROR,
                    message: generateUserErrorInfo(1, enumActionsErrors.ERROR_GET),
                    cause: "Error al analizar el parámetro de consulta JSON",
                })
            }
        }
        const { docs: payload, ...rest } = await this.model.paginate(parsedQuery, options);

        if (payload.length > 0) {
            const payloadWithoutPassword = payload.map(user => {
                const { _id,first_name, last_name, email,birthdate, role,last_connection,documents } = user;
                return { _id,first_name, last_name, email,birthdate, role,last_connection,documents };
            });
            return {
                status: "success",
                payload: payloadWithoutPassword,
                ...rest,
                prevLink: rest.hasPrevPage ? `/user?limit=${limit}&page=${rest.prevPage}` : null,
                nextLink: rest.hasNextPage ? `/user?limit=${limit}&page=${rest.nextPage}` : null,
            };
        } else {
            CustomError.createError({
                name: "USER ERROR",
                code: enumErrors.DATABASE_ERROR,
                message: generateUserErrorInfo(payload, enumActionsErrors.ERROR_GET),
                cause: 'No hay usuarios disponibles',
            })
        }
    }
    async getBy(filter, notPassword) {
        let user
        if (notPassword) {
            user = await this.model.findOne(filter).select('-password').lean();
        } else {
            user = await this.model.findOne(filter).lean();
        }
        if (user) {
            return { status: "success", payload: user };
        } else {
            CustomError.createError({
                name: "USER ERROR",
                code: enumErrors.DATABASE_ERROR,
                message: generateUserErrorInfo(user, enumActionsErrors.ERROR_GET),
                cause: 'Usuario no encontrado',
            })
        }
    }
    async exists(filter) {
        return await this.model.exists(filter).lean();
    }
    async create(newUser) {
        return await this.model.create(newUser)
    }
    async changeRole(uid) {
        const existingUser = await this.model.findOne({ _id: new ObjectId(uid) });
        if (!existingUser) {
            throw new Error('Usuario no encontrado')
        }
        if (existingUser.role === 'user') {
            existingUser.role = 'premium';
        } else {
            existingUser.role = 'user';
        }
        existingUser.save();
        return { status: "success", message: 'Usuario actualizado correctamente' };
    }
    async update(uid, userUpdate) {
        const existingUser = await this.model.findOne({ _id: new ObjectId(uid) });

        if (existingUser) {
            if (userUpdate.id && userUpdate.id !== uid.toString()) {
                throw new Error("No se permite modificar el campo 'id'")
            }
            const allowedProperties = ['first_name', 'last_name', 'email', 'birthdate', 'password', 'role', 'documents', 'last_connection'];

            const sanitizedUser = Object.keys(userUpdate)
                .filter(key => allowedProperties.includes(key))
                .reduce((obj, key) => {
                    obj[key] = userUpdate[key];
                    return obj;
                }, {});
            if (sanitizedUser.documents) {
                await this.model.updateOne({ _id: new ObjectId(uid) }, { $push: { documents: { $each: sanitizedUser.documents } } });
                return { status: "success", message: 'Usuario actualizado correctamente' };
            }
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
            return { status: "success", message: 'Usuario eliminado correctamente', payload: UserDelete }
        } else {
            throw new Error('Usuario no encontrado')
        }
    }
    async deleteUserInactive() {
        const currentDate = new Date();
        const twoDaysAgo = new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000);
        const usersToDelete = await this.model.find({
            last_connection: {
                $lt: twoDaysAgo
            }
        }).lean();
        if (usersToDelete.length > 0) {
            for (const user of usersToDelete) {
                try {
                    await this.model.findOneAndDelete({ _id: user._id }).lean();
                    const to = user.email
                    const subject = 'Cuenta eliminada por inactividad'
                    const html = `<div>
                    <h2>Tu cuenta ha sido eliminada por inactividad</h2>
                </div>`
                    sendMail(to, subject, html)
                } catch (error) {
                    console.error('Error al eliminar usuario o enviar correo electrónico:', error);
                }
            }
        }
    }
}

exports.UserMongo = UserDaoMongo;