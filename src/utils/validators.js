const CustomError = require("./errors");

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
        throw new CustomError(`ERROR: Debe completar los siguientes campos: ${missingFields.join(', ')}`);
    }

    return correctObject;
};

module.exports = validateFields