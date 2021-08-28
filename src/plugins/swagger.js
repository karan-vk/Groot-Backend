const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'GROOT API',
            description: 'A crowd sourcing app for trees',
            contact: {
                name: 'Karan'
            },
            servers: [`http://localhost:${process.env.PORT}`]
        }
    },
    apis: ['./**/index.js.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
    UI: swaggerUi.serve,
    DOCS: swaggerUi.setup(swaggerDocs)
}