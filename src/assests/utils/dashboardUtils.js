function getTotalBalance(arrOfObjects) {
    return arrOfObjects.reduce((acc, value) => {
        return acc + value.amount;
    }, 0);
}

function getHighestAmount(arrOfObjects) {
    
}

function getLowestAmount(arrOfObjects) {

}

export { 
    getTotalBalance
}