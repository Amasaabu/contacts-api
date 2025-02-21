//generate random id
const generateId = (prefix, max) => {
    var value = prefix + "-" + Math.floor(Math.random() * max) + Math.floor(Math.random() * max)
    return value
}

const validateUserInput = (body, compulsKey)=>{
    let error = true;
    let errorMessage = '';
    //verify input
    let keys = Object.keys(body);
    error = compulsKey.every(k => keys.includes(k));
    if (!error) {
        errorMessage = "Input error ensure all fields are provided";
    }
    return errorMessage;
}

module.exports = {
    generateId, validateUserInput
}