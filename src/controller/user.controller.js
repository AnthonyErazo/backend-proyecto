const { userService, cartsService } = require('../repositories');
const { logger } = require('../utils/logger');

class UserController {
    constructor() {
        this.service = userService
    }
    getDataUser=async (req,res)=>{
        try {
            const { uid } = req.params;
            const user=await this.service.getUser({_id:uid},true);
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
    userRoleChange=async(req,res)=>{
        try {
            const { uid } = req.params;
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
    deleteUser=async (req,res)=>{
        try {
            const { uid } = req.params;
            const user=await this.service.deleteUser(uid);
            await cartsService.deleteCart(user.payload.cart);
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