import { useEffect, useState } from "react";

import { useDash } from "../../pages/dashboardPage/DashboardProvider"
import { addCategory } from "../../services/firebaseFirestoreCategories";
import CategoryFormModal from "../categoryFormModal/CategoryFormModal";
import ExpenseCategory from "../expenseCategory/ExpenseCategory";
import "./dashboardExpense.scss";
import { Link } from "react-router-dom";

export default function DashboardExpense() {
    const {currentAccountName, categories, updateCategories} = useDash();
    const [isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return (
        <>  <h1 className="expense-account-heading"> User expense Categories</h1>
            <h1 className="expense-account-heading">Expense for: <Link to="/dashboard/accounts" className="expense-account-name">{currentAccountName}</Link></h1>
            <CategoryFormModal onSubmit={addCategory}/>
            <div className="categoriesWrapper">{
                isLoading ?
                <div>Loading...</div>
                :
                categories.length ?
                categories.map(category => <ExpenseCategory key={category.id} data={category} updateCategories={updateCategories}/> )
                :
                "NO CATEGORIES"
                
            }</div>
        </>
    )
}