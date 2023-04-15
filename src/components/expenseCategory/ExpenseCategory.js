import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'antd';

import "./expenseCategory.scss";
import {deleteCategory, editCategory, getUserCategories } from "../../services/firebaseFirestoreCategories";
import EditCategoryModal from "../editCategoryModal/EditCategoryModal";
import DeletePopconfirm from "../deletePopconfirm/DeletePopconfirm";


export default function ExpenseCategory({updateCategories,
  data: {
    id, category, categoryBackground, icon, iconColor, iconSize,
}}) {
    const [modalOpen, setModalOpen] = useState(false);

    const handleSettingsClick = () => {
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
        label: <DeletePopconfirm onConfirm={handleDeleteCategory} name={category}>
                Delete
                {/* <p className="ft-settings-option" onClick={handleDeleteCategory}>Delete</p> */}
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
          >
            <FontAwesomeIcon icon={icon} size={iconSize} color={iconColor} />
          </div>
          <h2 className="ft-category-name">{category}</h2>
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
      </>
    );
  }
// }

