const fs = require('fs');
const path = require('path')

const defaultPath = path.resolve(__dirname,'../Videos')

function viewLibrary(path=defaultPath){
    return fs.readdirSync(path)
}

module.exports = viewLibrary