const CustomError = require("./error/customErrors");
const { enumErrors } = require("./error/errorEnum");

const validateFields = (fields, requiredFields) => {
    const missingFields = [];
    const correctObject = requiredFields.reduce((acc, field) => {
        if (!fields[field]) {
            missingFields.push(field);
        } else {
            acc[field] = fields[field];
        }
        return acc;
    }, {});

    if (missingFields.length > 0) {
        CustomError.createError({
            cause: `Debe completar los siguientes campos: ${missingFields.join(', ')}`,
            message: `Error al ingresar usuario`,
            code:enumErrors.INVALID_TYPES_ERROR
        })
    }

    return correctObject;
};

module.exports = validateFields