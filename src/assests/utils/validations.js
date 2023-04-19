function isValidNumber(input) {

    const regex = /^\d+(\.\d{1,2})?$/;
    const isValidNumber = regex.test(input);   

    return isValidNumber;
}


export {
    isValidNumber,
}