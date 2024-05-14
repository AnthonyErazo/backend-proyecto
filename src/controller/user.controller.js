const { filter } = require('express-compression');
const { userService, cartsService } = require('../repositories');
const { logger } = require('../utils/logger');
const fs = require('fs');
const JSZip = require('jszip');

class UserController {
    constructor() {
        this.service = userService
    }
    getDataUser = async (req, res) => {
        try {
            const { uid } = req.params
            const user = await this.service.getUser({ _id: uid }, true);
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
    userRoleChange = async (req, res) => {
        try {
            const { uid } = req.params;
            const {payload}=await this.service.getUser({_id:uid},true);
            if(payload.documents.length<=0){
                return res.status(500).json({
                    status: 'error',
                    message: 'Error al actualizar usuario.',
                    error: error.message,
                    cause: error.cause
                });
            }
            const user = await this.service.changeRole(uid);
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
    deleteUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await this.service.deleteUser(uid);
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
    userDocuments = async (req, res) => {
        try {
            const userId = req.params.uid;

            if (!res.req.files || res.req.files.length === 0) {
                return res.status(400).send('No se recibió ningún archivo');
            }

            const documents = res.req.files.map(file => ({
                name: file.filename,
                reference: file.path
            }));
            await this.service.updateUser(userId, { documents });
            res.send('Documento subido exitosamente');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al subir el documento');
        }
    }
    getUsers = async (req, res) => {
        try {
            const { query } = req.query;
            const users = await this.service.getUsers(10, 1, query);
            return res.status(200).json(users);
        } catch (error) {
            logger.error('Error al traer usuarios:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al traer usuarios.',
                error: error.message,
                cause: error.cause
            });
        }
    }
    deleteUserInactive = async (req, res) => {
        try {
            const users = await this.service.deleteUserInactive();
            return res.status(200).json(users);
        } catch (error) {
            logger.error('Error al traer usuarios:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Error al traer usuarios.',
                error: error.message,
                cause: error.cause
            });
        }
    }
    donwloadDocuments = async (req, res) => {
        const { uid } = req.params
        const user = await this.service.getUser({ _id: uid }, true);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        const zip = new JSZip();

        user.payload.documents.forEach(document => {
            const documentContent = fs.readFileSync(document.reference);
            zip.file(document.name, documentContent);
        });

        zip.generateAsync({ type: 'nodebuffer' })
            .then(zipContent => {
                res.set('Content-Type', 'application/zip');
                res.set('Content-Disposition', 'attachment; filename=documents.zip');
                res.send(zipContent);
            })
            .catch(err => {
                console.error('Error al generar el archivo ZIP:', err);
                res.status(500).send('Error al generar el archivo ZIP');
            });
    }
}

module.exports = UserController