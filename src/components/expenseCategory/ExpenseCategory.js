import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from 'antd';

import "./expenseCategory.scss";
import CategoryFormModal from "../categoryFormModal/CategoryFormModal";
import { addCategory, editCategory } from "../../services/firebaseFirestoreCategories";
import EditCategoryModal from "../editCategoryModal/EditCategoryModal";


export default function ExpenseCategory({data: {
    id, category, categoryBackground, icon, iconColor, iconSize,
}}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSettingsClick = () => {
      setShowModal(true);
      setModalOpen(true);
    };
    
    // const handleModalClose = () => {
    //   setShowModal(false);
    // };
    
    const items = [
      {
        key: '1',
        label: <p className="ft-settings-option" onClick={handleSettingsClick}>Edit</p>,
      },
      {
        key: '2',
        label: <p className="ft-settings-option" onClick={handleSettingsClick}>Delete</p>,
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

