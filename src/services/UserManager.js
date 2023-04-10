// import axios from "axios";

import { auth, db } from '../firebase/firebase.js';
import { addDoc, collection } from "firebase/firestore"; 

class UserManager {

    // Add a new transaction to the "transactions" collection

     addTransaction = async (accountId, amount, category, type, fromAccountId) => {
        console.log(db);
        console.log(auth);

        try {


            const docRef = await addDoc(collection(db, "transactions"), {
                account_id: accountId,
                amount: amount,
                category: 'Card Deposit',
                type: type,
                date: new Date()
            });
          
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }



        // if (type === 'Expense') {

        //     db.collection('transactions').add({
        //         account_id: accountId,
        //         amount: amount,
        //         category: category,
        //         type: type,
        //         date: new Date(),
        //     })
        //         .then((docRef) => {
        //             console.log('Document written with ID: ', docRef.id);
        //         })
        //         .catch((error) => {
        //             console.error('Error adding document: ', error);
        //         });

        // }
        // else if (type === 'Deposit') {

        //     db.collection('transactions').add({
        //         account_id: accountId,
        //         amount: amount,
        //         category: 'Card Deposit',
        //         type: type,
        //         date: new Date(),
        //     })
        //         .then((docRef) => {
        //             console.log('Document written with ID: ', docRef.id);
        //         })
        //         .catch((error) => {
        //             console.error('Error adding document: ', error);
        //         });

        // }
        // else {

        //     db.collection('transactions').add({
        //         account_id: accountId,
        //         from_account_id: fromAccountId,
        //         amount: amount,
        //         category: 'Internal Transfer',
        //         type: type,
        //         date: new Date(),
        //     })
        //         .then((docRef) => {
        //             console.log('Document written with ID: ', docRef.id);
        //         })
        //         .catch((error) => {
        //             console.error('Error adding document: ', error);
        //         });

        //     db.collection('transactions').add({
        //         account_id: fromAccountId,
        //         to_account_id: accountId,
        //         amount: amount,
        //         category: 'Internal Transfer',
        //         type: type,
        //         date: new Date(),
        //     })
        //         .then((docRef) => {
        //             console.log('Document written with ID: ', docRef.id);
        //         })
        //         .catch((error) => {
        //             console.error('Error adding document: ', error);
        //         });
        // }

    };
}

let userManager = new UserManager();

export default userManager;



