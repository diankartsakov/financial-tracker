function getTotalBalance(arrOfObjects) {
    return arrOfObjects.reduce((acc, value) => {
        return acc + Number(value.amount);
    }, 0);
}

function getCurrentAccountBalance(arrOfObjects, id) {
    return arrOfObjects.find(obj => obj.accountId === id)?.amount;
}
function getAccountName(arrOfObjects, id) {
    return arrOfObjects.find(obj => obj.accountId === id)?.name;
}

export { 
    getTotalBalance, 
    getCurrentAccountBalance,
    getAccountName
}