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
async function getUserAccountsTransactions(accountIds) {
    
    const transactions = [];

    const q = query(collection(db, "transactions"), where("accountId", "in", accountIds));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        
        let transaction = doc.data();
        transaction.id = doc.id;
        transaction.date = transaction.date.toDate();

        if(transaction.type === 'Expense'){
            transaction.category = `${transaction.type} / ${transaction.category}`;
        }
        if(transaction.type === 'Transfer'){

            transaction.toAccountId ?
            transaction.category = 'Outgoing Transfer':
            transaction.category = 'Incoming Transfer';
        }

       transaction.amountString = `${transaction.amount.toFixed(2)} BGN`;

        transactions.push(transaction);

    });

    console.log(transactions);

    return transactions;
}

async function getUserAccountsFullInfo(uid) {
    const accounts = [];

    const q = query(collection(db, "accounts"), where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const obj = {
            name: doc._document.data.value.mapValue.fields.name.stringValue,
            balance: doc._document.data.value.mapValue.fields.amount.stringValue,
            accountId: doc.id
        }

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
        console.log("No such document!");
    }
}

export {
    getUserAccounts,
    getUserAccountsTransactions,
    getUserAccountsFullInfo,
    getAccount
}