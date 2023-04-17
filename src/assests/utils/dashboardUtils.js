function getTotalBalance(arrOfObjects) {
    return arrOfObjects.reduce((acc, value) => {
        return acc + value.amount;
    }, 0);
}

function getCurrentAccountBalance(arrOfObjects, id) {
    return arrOfObjects.find(obj => obj.accountId === id)?.amount;
}
function getAccountName(arrOfObjects, id) {
    return arrOfObjects.find(obj => obj.accountId === id)?.name;
}

// function getHighestAmount(arrOfObjects) {
    
// }

// function getLowestAmount(arrOfObjects) {

// }

export { 
    getTotalBalance, 
    getCurrentAccountBalance,
    getAccountName
}