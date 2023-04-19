import { db } from '../firebase/firebase.js';
import { doc, updateDoc, addDoc, collection, increment } from "firebase/firestore";
import { getAccount } from './firebaseFirestoreAccounts.js';

class AccountManager {

  addAccount = async (accountName, uid) => {
    try {

      const docRef = await addDoc(collection(db, "accounts"), {
        name: accountName,
        amount: 0,
        uid: uid
      });

      // console.log("Account created, ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      // console.error("Error creating account: ", e);
    }
  };

  validateAccountBalance =  async (accountId, amount) => {
    // console.log(accountId)
    let acc = await getAccount(accountId);
    return acc.amount - amount >= 0;
  };

  validateBalance = async (accountId, amount) => {
    // console.log(accountId)
    let acc = await getAccount(accountId);

    return acc.amount - amount;

  };

  updateBalance = async (accountId, balance, increase) => {


    const accRef = doc(db, "accounts", accountId);

    if(increase) {
      await updateDoc(accRef, {
        amount: increment(balance)
    });

    }
    else {
  
      await updateDoc(accRef, {
        amount: balance
      });
    }

  };

  addTransction = async (transaction) => {

    try {

      const docRef = await addDoc(collection(db, "transactions"), transaction);

      // console.log("Document written with ID: ", docRef.id);


    } catch (e) {
      // console.error("Error adding document: ", e);
    }

  };



  // Add a new transaction to the "transactions" collection
  initiateTransaction = async(accountName, accountId, amount, type, category, fromAccountId) => {

    let remainingBalance = 0;
    
    if (type !== "Deposit") {
        const idForValidateBalance = type === "Expense" ? accountId : fromAccountId.key;
        const isBalanceValid = await this.validateAccountBalance(idForValidateBalance, amount)
    
        if (!isBalanceValid) {
            // console.log("Insufficient Funds !");
            return{ok: false, error: true, message: "Insufficient Funds !"}
        }

        remainingBalance = await this.validateBalance(idForValidateBalance, amount); 
    }

    const transactionAcc =  {
        accountName: accountName,
        accountId: accountId,
        amount: Number(amount.toFixed(2)),
        type: type,
        category: category,
        date: new Date()
    }
    
    if (type === "Transfer") {
        if (!fromAccountId) {
            return  {ok: false, error: true, message:"From account is not selected!"}
        }

        transactionAcc.fromAccountId = fromAccountId.key;

        const toAccTransaction = {
            accountName: accountName,
            accountId: fromAccountId,
            amount: Number(amount.toFixed(2)),
            type: type,
            category: category,
            date: new Date(),
            toAccountId: accountId
        }

        await Promise.all([
            this.addTransction(transactionAcc), 
            this.updateBalance(accountId, amount, true),
            this.addTransction(toAccTransaction),
            this.updateBalance(fromAccountId.key, remainingBalance)
        ]);
   
        return  {ok: true, error: false, message: `You have successfully transferred ${amount} BGN from '${fromAccountId.label}' account.`}
    } else if (type === "Expense") {
        await Promise.all([
            this.addTransction(transactionAcc), 
            this.updateBalance(accountId, remainingBalance)
          ]);

        return {ok: true, error: false, message: `You have successfully paid ${amount} BGN for ${category}.`}
    } else {
        await Promise.all([
            this.addTransction(transactionAcc), 
            this.updateBalance(accountId, amount, true)
        ]);

        return  {ok: true, error: false, message: `You have successfully deposited ${amount} BGN.`}
    }
  }


};


let accountManager = new AccountManager();

export default accountManager;



