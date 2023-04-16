function getTotalBalance(arrOfObjects) {
    return arrOfObjects.reduce((acc, value) => {
        return acc + value.amount;
    }, 0);
}

export { 
    getTotalBalance
}