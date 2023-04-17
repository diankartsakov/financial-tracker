function getTotalBalance(arrOfObjects) {
    return arrOfObjects.reduce((acc, value) => {
        return acc + value.amount;
    }, 0);
}

function getCurrentAccountBalance(arrOfObjects, id) {
    const result = arrOfObjects.find(obj => {
        console.log(obj);
        console.log(id);
        // obj.accountId === id
    
    });
    console.log(result);
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