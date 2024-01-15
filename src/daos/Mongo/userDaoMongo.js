const { usersModel } = require('./models/user.model.js');

class UserDaoMongo {
    constructor() {
        this.model = usersModel;
    }
    async getUsersPaginate(limit = 10, page = 1) {
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            lean: true,
        };

        const { docs: payload, ...rest } = await this.model.paginate({}, options);

        if (payload.length > 0) {
            return {
                status: "success",
                payload,
                ...rest,
                prevLink: rest.hasPrevPage ? `/user?limit=${limit}&page=${rest.prevPage}` : null,
                nextLink: rest.hasNextPage ? `/user?limit=${limit}&page=${rest.nextPage}` : null,
            };
        } else {
            throw new Error('No hay usuarios disponibles');
        }
    }
    async getUsers() {
        return await this.model.find({}).select('-password').lean();
    }
    async getUserById(uid) {
        return await this.model.findOne({ _id: uid })
    }
    async getUserByMail(uemail) {
        return await this.model.findOne({ email: uemail })
    }
    async createUser(newUser) {
        return await this.model.create(newUser)
    }
    async updateUser(uid) {
        return await this.model.findOneAndUpdate({ _id: uid }, userUpdate).lean()
    }
    async deleteUser(uid) {
        return await this.model.findOneAndDelete({ _id: uid })
    }
}

exports.UserMongo = UserDaoMongo;