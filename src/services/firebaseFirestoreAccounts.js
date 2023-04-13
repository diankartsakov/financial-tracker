import { db } from "../firebase/firebase";
import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";

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

    const docRef = doc(db, "accounts", accountId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

        return docSnap.data();

    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

export {
    getUserAccounts,
    getUserAccountsFullInfo,
    getAccount
}