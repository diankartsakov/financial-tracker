function isValidNumber(input) {
    const regex = /^[0-9]+(\.[0-9]+)?$/;
    const isValidNumber = regex.test(input);   

    return isValidNumber;
}


export {
    isValidNumber,
}