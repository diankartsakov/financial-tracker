function getTotalBalance(arrOfObjects) {
    return arrOfObjects.reduce((acc, value) => {
        return acc + value.amount;
    }, 0);
}

function getCurrentAccountBalance(arrOfObjects, id) {
    return arrOfObjects.find(obj => obj.accountId === id)?.amount;
}

// function getHighestAmount(arrOfObjects) {
    
// }

// function getLowestAmount(arrOfObjects) {

// }

export { 
    getTotalBalance, 
    getCurrentAccountBalance
}