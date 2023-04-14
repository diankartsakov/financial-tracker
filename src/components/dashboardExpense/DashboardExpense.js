import { useEffect, useState } from "react";

import { useDash } from "../../pages/dashboardPage/DashboardProvider"
import { addCategory } from "../../services/firebaseFirestoreCategories";
import CategoryFormModal from "../categoryFormModal/CategoryFormModal";
import ExpenseCategory from "../expenseCategory/ExpenseCategory";

export default function DashboardExpense() {
    const {currentAccountName, categories} = useDash();
    const [isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    return (
        <>
            <h1>{currentAccountName} EXPENSE</h1>
            <CategoryFormModal onSubmit={addCategory}/>
            <div className="categoriesWrapper" style={{
                display:"flex", flexWrap: "wrap", gap: "15px",
            }}>{
                isLoading ?
                <div>Loading...</div>
                :
                categories.length ?
                categories.map(category => <ExpenseCategory key={category.id} data={category}/> )
                :
                "NO CATEGORIES"
                
            }</div>
        </>
    )
}