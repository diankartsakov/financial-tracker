import { useEffect, useState } from "react";

import { useDash } from "../../pages/dashboardPage/DashboardProvider"
import { addCategory } from "../../services/firebaseFirestoreCategories";
import CategoryFormModal from "../categoryFormModal/CategoryFormModal";
import ExpenseCategory from "../expenseCategory/ExpenseCategory";
import moneyIMG from "../../assests/images/amount-logo.png"
import "./dashboardExpense.scss";
import ExpenseDropdown from "../expenseDropdown/ExpenseDropdown";
import { Link } from "react-router-dom";


export default function DashboardExpense() {
    const {currentAccountName, accountId, categories, accountsArr, updateCategories} = useDash();
    const [isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return (
        <>  
            <header className="expense-header">
                <h1 className="expense-account-heading"> User Expense Categories</h1>
                <h2 className="expense-account-sub-heading">
                    Expense current account:  
                    {
                        accountsArr?.length
                        ?
                            <>
                                <ExpenseDropdown/>
                                <div className="account-amount-wrapper">
                                    <img src={moneyIMG} alt="money logo"/>
                                    <p>{accountsArr.find(acc => acc.accountId === accountId).amount} BGN</p>
                                </div>
                            </>
                        :
                        <p style={{paddingLeft: "10px"}}>You're almost there! Please <Link  to={"/dashboard/accounts"}>Link an account</Link> to use this feature.</p>
                    }
                </h2>
            </header>
           
            <CategoryFormModal onSubmit={addCategory}/>
            <div className="categoriesWrapper">
                {
                    isLoading ?
                    <div>Loading...</div>
                    :
                    categories.length ?
                    categories.map(category => <ExpenseCategory key={category.id} data={category} updateCategories={updateCategories}/> )
                    :
                    "NO CATEGORIES"
                }
            </div>
            
        </>
    )
}