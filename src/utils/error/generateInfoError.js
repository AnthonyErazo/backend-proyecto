const { enumActionsErrors } = require("./enumActionsErrors")


const generateErrorInfo = (entity,data, action) => {
    const entityName = entity.charAt(0).toUpperCase() + entity.slice(1);
    let message = `One or more properties were incomplete or not valid.\nList of required properties\n`;

    if (!data) {
        message += `- ${entityName} not found, received ${data}\n`;
    }
    
    switch (action) {
        case enumActionsErrors.ERROR_ADD:
            message += `- ${entityName} not added: can't add new ${entity} to database`;
            break;
        case enumActionsErrors.ERROR_GET:
            message += `- ${entityName} not found: no ${entity} found for the specified query`;
            break;
        case enumActionsErrors.ERROR_UPDATE:
            message += `- ${entityName} not updated: no ${entity} found for the specified update operation`;
            break;
        case enumActionsErrors.ERROR_DELETE:
            message += `- ${entityName} not deleted: no ${entity} found for the specified delete operation`;
            break;
        default:
            break;
    }

    return message;
};

const generateProductErrorInfo = (product, action) => {
    return generateErrorInfo('product',product, action);
};

const generateCartErrorInfo = (cart, action) => {
    return generateErrorInfo('cart',cart, action);
};
const generateUserErrorInfo = (user, action) => {
    return generateErrorInfo('user',user, action);
};

const generateTicketErrorInfo = (ticket, action) => {
    return generateErrorInfo('ticket',ticket, action);
};
module.exports = {
    generateProductErrorInfo,
    generateCartErrorInfo,
    generateTicketErrorInfo,
    generateUserErrorInfo
}