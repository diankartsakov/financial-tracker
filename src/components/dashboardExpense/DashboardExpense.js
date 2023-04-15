import { useEffect, useState } from "react";

import { useDash } from "../../pages/dashboardPage/DashboardProvider"
import { addCategory } from "../../services/firebaseFirestoreCategories";
import CategoryFormModal from "../categoryFormModal/CategoryFormModal";
import ExpenseCategory from "../expenseCategory/ExpenseCategory";
import "./dashboardExpense.scss";

export default function DashboardExpense() {
    const {currentAccountName, categories, updateCategories} = useDash();
    const [isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return (
        <>
            <h1>{currentAccountName} EXPENSE</h1>
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