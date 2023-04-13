import { useDash } from "../../pages/dashboardPage/DashboardProvider"
import CategoryFormModal from "../categoryFormModal/CategoryFormModal";

export default function DashboardExpense() {
    const {currentAccountName} = useDash();

    return (
        <>
            <h1>{currentAccountName} EXPENSE</h1>
            <CategoryFormModal/>
        </>
    )
}