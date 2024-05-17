const { enumErrors } = require("./errorEnum")

exports.handleError = (err, req, res, next) => {
    switch (err.code) {
        case enumErrors.DATABASE_ERROR:
            return res.send({
                status: 'error',
                cause: err.cause,
                message: err.message,
                code:enumErrors.DATABASE_ERROR,
                type: `ERROR DATABASE`
            })

        case enumErrors.INVALID_TYPES_ERROR:
            return res.send({
                status: 'error',
                cause: err.cause,
                message: err.message,
                code:enumErrors.INVALID_TYPES_ERROR,
                type: `ERROR INVALID TYPES ERROR`
            })

        case enumErrors.ROUTING_ERROR:
            return res.send({
                status: 'error',
                cause: err.cause,
                message: err.message,
                code:enumErrors.ROUTING_ERROR,
                type: `ERROR ROUTING ERROR`
            })

        default:
            return res.status(500).send({ status: 'error', error: 'error server' })
    }
}