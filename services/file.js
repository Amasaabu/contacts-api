const fs = require("fs")
const {VALUES} = require("../values")
const initializeJSONFile = async (file) => {
        //ensure the file exists
        if (!fs.existsSync(VALUES.SAVE_FILE)) {
            console.log('save file does not exist, createing file...')
            fs.writeFileSync(VALUES.SAVE_FILE, "")
            console.log('file created')
        } else {
            console.log('file exists')
        }
}


module.exports = {initializeJSONFile}