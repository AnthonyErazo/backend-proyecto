class UserRepository {
    constructor(dao){
        this.dao = dao
    }

    getUsers   = async (limit,page,filter) => await this.dao.get(limit,page,filter)
    getUser    = async (filter,notPassword) => await this.dao.getBy(filter,notPassword)
    existsUser = async (filter) => await this.dao.exists(filter)
    createUser = async (newUser) => await this.dao.create(newUser)
    updateUser = async (uid, userUpdate) => await this.dao.update(uid, userUpdate)
    deleteUser = async (uid) => await this.dao.delete(uid)

}

module.exports = UserRepository