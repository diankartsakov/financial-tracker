import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Dropdown, notification } from 'antd';
import accountManager from "../../services/AccountManager";
import "./expenseCategory.scss";
import {deleteCategory, editCategory, getUserCategories } from "../../services/firebaseFirestoreCategories";
import { Link } from "react-router-dom";
import EditCategoryModal from "../editCategoryModal/EditCategoryModal";
import DeletePopconfirm from "../deletePopconfirm/DeletePopconfirm";
import NewExpenseModal from "../newExpenseModal/NewExpenseModal";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useAuth } from "../../firebase/auth";

export default function ExpenseCategory({updateCategories,
  data: {
    id, category, categoryBackground, icon, iconColor, iconSize,
}}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [expenseModalOpen, setExpenseModalOpen] = useState(false);
    const [serverResult, setServerResult] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {accountId, currentAccountName, accountsArr, updateAccountsArr} = useDash();
    const {authUser: {uid}} = useAuth();
    const [api, contextHolder] = notification.useNotification();
    
    const descriptionMessage = (<>
      <p style={{fontSize: "16px", fontWeight: 600}}>
        Your expense could not be processed as there is no account linked to your profile. Please link an account to your profile and try again.
      </p>
      <p style={{fontSize: "16px", fontWeight: 600}}>
        To link an account, please visit your <Link to="/dashboard/accounts">Accounts page</Link> and add a valid account number. Once an account is linked, you will be able to create and submit expenses successfully. Thank you for your attention to this matter.
      </p>
    </>);
    
    const openNotification = (placement) => {
        api.info({
        message: `Account Association Required`,
        description: descriptionMessage,
        placement,
        });
    }

    const handleNewExpenseClick = () => {
        if (accountId) {
          setExpenseModalOpen(true);
        } else {
          openNotification("top");
        }
    };
    const handleModalCancel = () => {
        setExpenseModalOpen(false);
        setServerResult("");
    };



    const handleExpenseCreate = async (amount,delay) => {
      const accountObj = accountsArr.find(el => el.accountId === accountId);

        const data = [accountObj, amount, "Expense", category]
        let result = null;
        if(delay === 'none'){
            
            result = await accountManager.initiateTransaction(...data);
            //   const result = await accountManager.initiateTransaction(...data);
          // console.log(result);
            setServerResult(result);
            
        //   return result;
        } else {
            data.push(delay);
    
            result = await accountManager.initiateFrozenTransaction(...data);
            setServerResult(result);
        }

        const arr = [...accountsArr];
        const account =  arr.find(acc => acc.accountId === accountId);

        account.amount = (Number(account.amount) - Number(amount)).toFixed(2);
        
        if (delay !== "none") {
            account.frozenAmount = (Number(account.frozenAmount) + Number(amount)).toFixed(2);
        }
        // // OLD UPDATE ARR
        // // const accountsFullInfo = await getUserAccountsFullInfo(uid);
        updateAccountsArr(arr);
        
        if (delay === "one-min") {
            setDelayFrozen(result.transaction);
        }
    };

    const setDelayFrozen = (transaction) => {
    //   console.log(transaction)
      const currentDate = new Date();
      const unfreezeDate = transaction.unfreezeDate;
  
      const timeLeft = unfreezeDate.getTime() - currentDate.getTime();
    //   console.log(timeLeft);
      setTimeout(async () => {
        //   console.log([transaction]);
            await accountManager.processFrozenTransactions([transaction]);
          const arr = [...accountsArr];
          const account =  arr.find(acc => acc.accountId === transaction.accountId);

          account.frozenAmount = (Number(account.frozenAmount) - Number(transaction.amount)).toFixed(2);
          updateAccountsArr(arr);
          console.log("update frozen amount");
          
      }, timeLeft >= 0 ? timeLeft : 0);
  }
  

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
        { accountId ? <NewExpenseModal
                open={expenseModalOpen}
                onCancel={handleModalCancel}
                category={category}
                onSubmit={handleExpenseCreate}
                serverResult={serverResult}
            /> : <>  {contextHolder} </>
           }
      </>
    );
  }


