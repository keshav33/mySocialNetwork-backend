exports.capitalizeString = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

exports.getCurrentDate = () => {
    return new Date().toISOString()
}