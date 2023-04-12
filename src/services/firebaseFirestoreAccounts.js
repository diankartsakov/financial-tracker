import {db} from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

async function getUserAccounts(uid) {
    const accounts = [];

    const q = query(collection(db, "accounts"), where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());

        accounts.push(doc.id);
    });
    
    return accounts;
}

async function getUserAccountsFullInfo(uid) {
    const accounts = [];

    const q = query(collection(db, "accounts"), where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());

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

    const q = query(collection(db, "accounts"), where("id", "==", accountId));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
    
            //accounts.push(doc.id);
        });
    
    //return Number(account._document.data.value.mapValue.fields.amount.stringValue);
}

export {
    getUserAccounts,
    getUserAccountsFullInfo,
    getAccount
}