import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'antd';
import accountManager from "../../services/AccountManager";
import "./expenseCategory.scss";
import {deleteCategory, editCategory, getUserCategories } from "../../services/firebaseFirestoreCategories";
import EditCategoryModal from "../editCategoryModal/EditCategoryModal";
import DeletePopconfirm from "../deletePopconfirm/DeletePopconfirm";
import NewExpenseModal from "../newExpenseModal/NewExpenseModal";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useAuth } from "../../firebase/auth";
import { getUserAccountsFullInfo } from "../../services/firebaseFirestoreAccounts";

export default function ExpenseCategory({updateCategories,
  data: {
    id, category, categoryBackground, icon, iconColor, iconSize,
}}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [expenseModalOpen, setExpenseModalOpen] = useState(false);
    const [serverResult, setServerResult] = useState("");
    const {accountId, currentAccountName, updateAccountsArr} = useDash();
    const {authUser: {uid}} = useAuth();

    const handleNewExpenseClick = () => {
        setExpenseModalOpen(true);
    };
    const handleModalCancel = () => {
        setExpenseModalOpen(false);
        setServerResult("");
    };
  
    const handleExpenseCreate = async (amount) => {
        const data = [currentAccountName, accountId, amount, "Expense", category, ]
        // console.log(data);
        const result = await accountManager.initiateTransaction(...data);
        // console.log(result);
        setServerResult(result);
        const accountsFullInfo = await getUserAccountsFullInfo(uid);
        updateAccountsArr(accountsFullInfo);

        return result;
    };

    const handleSettingsClick = (e) => {
        setModalOpen(true);
    };
    
    const handleDeleteCategory = async () => {
        await deleteCategory(id);
        const arr = await getUserCategories();
        updateCategories(arr);
    }
    
    const items = [
      {
        key: '1',
        label: <p className="ft-settings-option" onClick={handleSettingsClick}>Edit</p>,
      },
      {
        key: '2',
        label: <DeletePopconfirm className="ft-settings-option" onClick={(e) => e.stopPropagation()} onConfirm={handleDeleteCategory} name={category}>
                <p className="ft-settings-option">Delete</p>
              </DeletePopconfirm>,
      },
    ]
    
    return (
      <>
        <div className="ft-category-wrapper">
            <div
              className="ft-icon-circle"
              style={{
                border: `5px solid ${iconColor}`,
                backgroundColor: categoryBackground,
              }}
              onClick={handleNewExpenseClick}
            >
              <FontAwesomeIcon icon={icon} size={iconSize} color={iconColor} />
            </div>
          
          <h2 className="ft-category-name"  onClick={handleNewExpenseClick}>{category}</h2>
          <Dropdown menu={{
            items,
            }} overlayClassName="ft-settings-dropdown" trigger={['hover']}>
            <div className="ft-settings-btn">
              <FontAwesomeIcon icon={faEllipsisV} size="lg" color="black" />
            </div>
          </Dropdown>
        </div>
        {modalOpen && <EditCategoryModal modal={{modalOpen, setModalOpen}} onSubmit={editCategory}
                data={{
                  id, category, categoryBackground, icon, iconColor, iconSize,
                }}/>
        }
         <NewExpenseModal
            open={expenseModalOpen}
            onCancel={handleModalCancel}
            category={category}
            onSubmit={handleExpenseCreate}
            serverResult={serverResult}
        />
      </>
    );
  }


