import { useEffect, useState } from "react";

import { useDash } from "../../pages/dashboardPage/DashboardProvider"
import { addCategory, getUserCategories } from "../../services/firebaseFirestoreCategories";
import CategoryFormModal from "../categoryFormModal/CategoryFormModal";
import ExpenseCategory from "../expenseCategory/ExpenseCategory";

export default function DashboardExpense() {
    const [isLoading, setIsLoading ] = useState(true);
    const [categories, setCategories] = useState([]);
    const {currentAccountName} = useDash();

    useEffect(() => {

        const getCategories = async() => {
            const categoriesResult = await getUserCategories();
            console.log(categoriesResult);
            setCategories(categoriesResult);
            setIsLoading(false);
        }

        getCategories();
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
                categories.map(category => <ExpenseCategory key={category.id} data={category}/> )
                :
                "NO CATEGORIES"
                
            }</div>
        </>
    )
}