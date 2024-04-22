const chai = require('chai')
const supertest = require('supertest')
const jwt = require('jsonwebtoken');
const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing de aplicacion', () => {
    describe('Test de productos', () => {
        it('Prueba de obtener todos los productos, GET /api/products. Debe traer todos los productos.', async () => {
            const { statusCode, _body } = await requester.get('/api/products')
            expect(statusCode).to.ok
            expect(_body.status).to.equal('success')
        })
        it('Prueba de insertar un producto, POST /api/products. Debe insertar un producto.', async () => {
            const productMock = {
                title: "producto test",
                description: "descripcion test",
                price: 102,
                thumbnail: ['url test 1', 'url test 2'],
                code: 1373,
                stock: 120,
                status: true,
                category: "categoria test",
                owner: 'admin'
            }
            const { statusCode, _body } = await requester.post('/api/products').send(productMock)
            idProduct = _body.payload._id
            expect(statusCode).to.ok
            expect(_body.payload.code).to.equal(productMock.code)
            expect(_body.status).to.equal('success')
        })
        it('Prueba de actualizar un producto, PUT /api/products/:pid. Debe actualizar un producto.', async () => {
            const productUpdateMock = {
                title: "producto actualziado",
                stock: 124
            }
            const { statusCode, _body } = await requester.put(`/api/products/${idProduct}`).send(productUpdateMock);
            expect(statusCode).to.equal(200);
            expect(_body.status).to.equal('success');
        })
    })
    describe('Test de session', () => {
        it('Prueba de registro de usuario, POST /api/sessions/register. Debe registrar un usuario.', async () => {
            const userMock = {
                first_name: 'nombre',
                last_name: 'apellido',
                email: 'email@email.com',
                birthdate: '10/10/2000',
                password: '123456789'
            }
            const { statusCode, _body } = await requester.post('/api/sessions/register').send(userMock)
            expect(statusCode).to.be.ok
            expect(_body).to.ok.and.have.property('message')
        })
        it('Prueba de logear un usuario, POST /api/sessions/login. Debe insertar cookie de usuario.', async () => {
            const userLoginMock = {
                email: 'email@email.com',
                password: '123456789'
            }
            const response=await requester.post('/api/sessions/login').send(userLoginMock)
            const cookieResponse=response.headers['set-cookie'][0]
            expect(cookieResponse).to.be.ok

            cookie={
                name:cookieResponse.split('=')[0],
                value:cookieResponse.split('=')[1]
            }
            decodedToken = jwt.decode(cookie.value.split(';')[0]);
            expect(cookie.name).to.be.ok.and.equal('token')
            expect(cookie.value).to.be.ok
            expect(decodedToken).to.have.property('id');
        })
        it('Prueba datos sensibles, GET /api/products/current. El usuario con role user no debe ingresar a esta ruta.', async () => {
            const {statusCode,error} = await requester.get('/api/sessions/current').set('Cookie',[`${cookie.name}=${cookie.value}`])
            expect(error.text).to.equal('Access forbidden')
            expect(statusCode).to.be.ok.and.equal(403);
        })
    })
    describe('Test de carrito', () => {
        it('Prueba de insertar un producto al carrito, POST /api/carts/:cid/product/:pid. Debe insertar un producto en el carrito.', async () => {
            const response=await requester.get(`/api/users/${decodedToken.id}`)
            dataUser=response._body
            const { statusCode, _body } = await requester.post(`/api/carts/${dataUser.payload.cart}/product/${idProduct}`)
            expect(_body.data.products).to.not.equal([])
            expect(_body.success).to.equal('success')
            expect(statusCode).to.be.ok
        })
        it('Prueba de actualizar la cantidad de un producto en el carrito, PUT /api/carts/:cid/products/:pid. Actualizar la cantidad de un producto en el carrito.', async () => {
            const newQuantity={
                quantity:10
            }
            const { statusCode, _body } = await requester.put(`/api/carts/${dataUser.payload.cart}/products/${idProduct}`).send(newQuantity)
            expect(_body.success).to.equal('success')
            expect(_body.data.products[0].quantity).to.be.equal(newQuantity.quantity)
            expect(statusCode).to.be.ok
        })
        it('Prueba de eliminar todos los productos de un carrito, DELETE /api/carts/:cid. Debe eliminar todos los productos del carrito.', async () => {
            const { statusCode, _body } = await requester.delete(`/api/carts/${dataUser.payload.cart}`)
            expect(_body.success).to.equal('success')
            expect(_body).to.have.property('message')
            expect(statusCode).to.be.ok
        })
    })
    after(async () => {
        await requester.delete(`/api/products/${idProduct}`).send({ idUser: 'admin' });
        await requester.delete(`/api/users/${decodedToken.id}`);
    });
})