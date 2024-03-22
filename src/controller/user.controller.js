const { userService } = require('../repositories');
const { logger } = require('../utils/logger');

class UserController {
    constructor() {
        this.service = userService
    }
    userRoleChange=async(req,res)=>{
        try {
            const { uid } = req.params;
            const role=req.body;
            const user=await this.service.changeRole(uid);
            return res.status(200).json(user);
        } catch (error) {
            logger.error('Error al cambiar role de usuario:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al actualizar usuario.',
                error: error.message,
                cause: error.cause
            });
        }
    }
}

module.exports = UserController