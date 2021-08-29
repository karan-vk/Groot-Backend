const fs = require('fs');
var path = require('path');
const capitalizeFirstLetter = require('../capitalize');

const verifyGenerator = async (code, name) => {

    return fs.readFileSync(path.join(__dirname) + '/verify.html', 'utf8').replace('{{code}}', code).replace('{{name}}', capitalizeFirstLetter(name)).toString();

}

const restGenerator = async (code, name) => {

    return fs.readFileSync(path.join(__dirname) + '/rest.html', 'utf8').replace('{{Code}}', code).replace('{{name}}', capitalizeFirstLetter(name)).toString();

}

module.exports = { verifyGenerator, restGenerator }