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
        accounts.push(doc);
    });
    
    return accounts;
}

export {
    getUserAccounts,
}