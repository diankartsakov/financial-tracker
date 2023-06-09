import { db } from "../firebase/firebase";
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";

async function getUserAccounts(uid) {
    const accounts = [];

    const q = query(collection(db, "accounts"), where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        accounts.push(doc.id);
    });

    return accounts;
}

async function getUserAccountsTransactionsCounts(accountIds=[]) {
    const transactionsInfo = {
        expense: 0,
        deposit: 0,
        transfer: 0,
        totalCount: 0,
    };

    if (accountIds.length === 0) {
        return transactionsInfo;
    }

    const transfersIds = [];

    const q = query(collection(db, "transactions"), where("accountId", "in", accountIds));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        
        const transaction = doc.data(); 
        const id = doc.id;

        if(transaction.type === 'Expense') {
            transactionsInfo.expense++;
        } else if (transaction.type === 'Transfer' && !transfersIds.includes(id)){
            transactionsInfo.transfer++;
            transfersIds.push(id);
        } else if(transaction.type === 'Deposit') {
            transactionsInfo.deposit++;
        }

        transactionsInfo.totalCount++;
    });

    return transactionsInfo;
}


async function getUserAccountsTransactions(accountIds=[]) {
    
    const transactions = [];

    if (accountIds.length === 0) {
        return transactions;
    }


    const q = query(collection(db, "transactions"), where("accountId", "in", accountIds));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        
        let transaction = doc.data();
        transaction.id = doc.id;
        transaction.date = transaction.date.toDate();


        if(transaction.type === 'Expense'){

            if(transaction.isFrozen){
                transaction.mixedCategory = `Frozen ${transaction.type} / ${transaction.category}`;
            }
            else{
                transaction.mixedCategory = `${transaction.type} / ${transaction.category}`;
            }
        }
        else if(transaction.type === 'Transfer'){

            transaction.toAccountId ?
            transaction.mixedCategory = 'Outgoing Transfer':
            transaction.mixedCategory = 'Incoming Transfer';
        }
        else {
            transaction.mixedCategory = transaction.category;
        }


       transaction.amountString = `${transaction.amount.toFixed(2)} BGN`;

        transactions.push(transaction);

    });


    return transactions;
}

async function getUserAccountsFullInfo(uid) {
    const accounts = [];

    const q = query(collection(db, "accounts"), where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        
        const obj = doc.data();
        obj.accountId = doc.id;

        accounts.push(obj);
    });

    return accounts;
}

async function getAccount(accountId) {

    const docRef = doc(db, "accounts", accountId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

        return docSnap.data();

    } else {
    }
}


async function getUserAccountsFrozenTransactionsForUpdate(accountIds=[]) {
    
    const transactions = [];

    const currentDate = new Date();

    if (accountIds.length === 0) {
        return transactions;
    }


    const q = query(collection(db, "transactions"), where("accountId", "in", accountIds), where("isFrozen", "==", true));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        
        let transaction = doc.data();

        transaction.id = doc.id;
        transaction.date = transaction.date.toDate();
        transaction.unfreezeDate = transaction.unfreezeDate.toDate();

        if(currentDate.valueOf() >= transaction.unfreezeDate.valueOf()){

            transactions.push(transaction);

        }
    });


    return transactions;
}

export {
    getUserAccounts,
    getUserAccountsTransactions,
    getUserAccountsTransactionsCounts,
    getUserAccountsFullInfo,
    getAccount,
    getUserAccountsFrozenTransactionsForUpdate
}