const { Router } = require('express')
const { faker } = require('@faker-js/faker')

const generateProducts = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
        code: faker.commerce.isbn(),
        stock: faker.string.numeric(),
        category: faker.word.noun(),
    }
}

const router = Router()

router
    .get('/mockingproducts', (req, res) => {

        let products = []

        for (let i = 0; i < 100; i++) {
            products.push(generateProducts())
        }

        res.json({
            status: 'success',
            payload: products
        })
    })
    .get('/loggerTest', (req, res) => {
        req.logger.debug('Debug message')
        req.logger.http('HTTP message')
        req.logger.info('Info message')
        req.logger.warning('Warning message')
        req.logger.error('Error message')
        req.logger.fatal('Fatal message')
        res.send('Logging test completed')
    })

module.exports = router