import { db } from '../firebase/firebase.js';
import { doc, updateDoc, addDoc, collection, increment } from "firebase/firestore";
import { getAccount } from './firebaseFirestoreAccounts.js';
class AccountManager {

  addAccount = async (accountName, uid) => {
    try {

      const docRef = await addDoc(collection(db, "accounts"), {
        name: accountName,
        amount: '0.00',
        frozenAmount: '0.00',
        uid: uid
      });

      return docRef.id;
    } catch (e) {
    }
  };

  updateBalance = async (accountId, newBalance, isFrozen) => {


    if (!isFrozen) {

      const accRef = doc(db, "accounts", accountId);

      await updateDoc(accRef, {
        amount: newBalance.toFixed(2)
      });
    }
    else {
      const accRef = doc(db, "accounts", accountId);

      await updateDoc(accRef, {
        frozenAmount: newBalance.toFixed(2)
      });
    }
  };


  processFrozenTransactions = async(transactionsArr) => {

    for (const transaction of transactionsArr) {

      const accRef = doc(db, "transactions", transaction.id);

      const acc = await getAccount(transaction.accountId);
      const newFrozenBalance = Number(acc.frozenAmount) - transaction.amount;
  
      await updateDoc(accRef, {
        date: transaction.unfreezeDate,
        isFrozen: false
      });
  
      await this.updateBalance(transaction.accountId, newFrozenBalance, true);
    }    
  };



  addTransction = async (transaction) => {

    try {

      const docRef = await addDoc(collection(db, "transactions"), transaction);



    } catch (e) {
    }

  };

  // Add a new transaction to the "transactions" collection
  initiateTransaction = async (accountObj, amount, type, category, fromAccountId) => {

    let remainingBalance = 0;

    if (type !== "Deposit") {
      type === "Expense" ?

        remainingBalance = Number(accountObj.amount) - amount :
        //case Transfer
        remainingBalance = Number(fromAccountId.amount) - amount;

      if (remainingBalance < 0) {
        return { ok: false, error: true, message: "Insufficient Funds !" };
      }

    }

    const receiverNewBalance = Number(accountObj.amount) + amount;

    const transactionAcc = {
      accountName: accountObj.name,
      accountId: accountObj.accountId,
      amount: Number(amount.toFixed(2)),
      type: type,
      category: category,
      date: new Date(),
      isFrozen: false
    }

    if (type === "Transfer") {
      if (!fromAccountId) {
        return { ok: false, error: true, message: "From account is not selected!" }
      }
      transactionAcc.fromAccountId = fromAccountId.accountId;

      const toAccTransaction = {
        accountName: fromAccountId.name,
        accountId: fromAccountId.accountId,
        amount: Number(amount.toFixed(2)),
        type: type,
        category: category,
        date: new Date(),
        isFrozen: false,
        toAccountId: accountObj.accountId
      }




      await Promise.all([
        this.addTransction(transactionAcc),
        this.updateBalance(accountObj.accountId, receiverNewBalance),
        this.addTransction(toAccTransaction),
        this.updateBalance(fromAccountId.accountId, remainingBalance)
      ]);

      return { ok: true, error: false, message: `You have successfully transferred ${amount} BGN from '${fromAccountId.name}' account.` }

    } else if (type === "Expense") {
      await Promise.all([
        this.addTransction(transactionAcc),
        this.updateBalance(accountObj.accountId, remainingBalance)
      ]);

      return { ok: true, error: false, message: `You have successfully paid ${amount} BGN for ${category}.` }
    } else {
      await Promise.all([
        this.addTransction(transactionAcc),
        this.updateBalance(accountObj.accountId, receiverNewBalance)
      ]);

      return { ok: true, error: false, message: `You have successfully deposited ${amount} BGN.` }
    }
  }




  initiateFrozenTransaction = async (accountObj, amount, type, category, when) => {

    const remainingBalance = Number(accountObj.amount) - amount;

    if (remainingBalance < 0) {
      return { ok: false, error: true, message: "Insufficient Funds !" };
    }

    const newFrozenBalance = Number(accountObj.frozenAmount) + amount;

    const today = new Date();
    const unfreezeDate  = new Date();

    if (when === 'one-month') {
      unfreezeDate.setMonth(unfreezeDate.getMonth() + 1);
      
    } else if (when === 'one-min'){
      // unfreezeDate.setMinutes(unfreezeDate.getMinutes() + 1);
      unfreezeDate.setSeconds(unfreezeDate.getSeconds() + 10);
    }
    else {
      unfreezeDate.setDate(unfreezeDate.getDate() + 7);
    }

    const transaction = {
      accountName: accountObj.name,
      accountId: accountObj.accountId,
      amount: Number(amount.toFixed(2)),
      type: type,
      category: category,
      date: today,
      isFrozen: true,
      unfreezeDate: unfreezeDate
    };


    const resultPromise = await Promise.all([
      addDoc(collection(db, "transactions"), transaction),
      this.updateBalance(accountObj.accountId, newFrozenBalance, true),
      this.updateBalance(accountObj.accountId, remainingBalance)
    ]);

    transaction.id = resultPromise[0].id;

    return {
      ok: true,
      error: false,
      message: `Your '${category}' transaction for ${amount.toFixed(2)} BGN will be 
      processed on ${unfreezeDate.getDate()}-${unfreezeDate.getMonth() + 1}-${unfreezeDate.getFullYear()}. 
      ${amount.toFixed(2)} BGN was moved to your Frozen Balance.`,
      transaction,
    }

  };

};


let accountManager = new AccountManager();

export default accountManager;



