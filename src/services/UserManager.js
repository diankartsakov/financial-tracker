// import axios from "axios";

import { db } from '../firebase/firebase.js';

class UserManager {

    // Add a new transaction to the "transactions" collection

    addTransaction = (accountId, amount, category, type, fromAccountId) => {
        console.log(db);

        if (type === 'Expense') {

            db.collection('transactions').add({
                account_id: accountId,
                amount: amount,
                category: category,
                type: type,
                date: new Date(),
            })
                .then((docRef) => {
                    console.log('Document written with ID: ', docRef.id);
                })
                .catch((error) => {
                    console.error('Error adding document: ', error);
                });

        }
        else if (type === 'Deposit') {

            db.collection('transactions').add({
                account_id: accountId,
                amount: amount,
                category: 'Card Deposit',
                type: type,
                date: new Date(),
            })
                .then((docRef) => {
                    console.log('Document written with ID: ', docRef.id);
                })
                .catch((error) => {
                    console.error('Error adding document: ', error);
                });

        }
        else {

            db.collection('transactions').add({
                account_id: accountId,
                from_account_id: fromAccountId,
                amount: amount,
                category: 'Internal Transfer',
                type: type,
                date: new Date(),
            })
                .then((docRef) => {
                    console.log('Document written with ID: ', docRef.id);
                })
                .catch((error) => {
                    console.error('Error adding document: ', error);
                });

            db.collection('transactions').add({
                account_id: fromAccountId,
                to_account_id: accountId,
                amount: amount,
                category: 'Internal Transfer',
                type: type,
                date: new Date(),
            })
                .then((docRef) => {
                    console.log('Document written with ID: ', docRef.id);
                })
                .catch((error) => {
                    console.error('Error adding document: ', error);
                });
        }

    };
}

let userManager = new UserManager();

export default userManager;



