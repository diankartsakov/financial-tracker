import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Modal, Popover } from 'antd';

import "./expenseCategory.scss";
import CategoryFormModal from "../categoryFormModal/CategoryFormModal";
export default function ExpenseCategory({data: {
    id, category, categoryBackground, icon, iconColor, iconSize,
}}) {
    // const [showMenu, setShowMenu] = useState(false);
    // const [showModal, setShowModal] = useState(false);

    // const handleSettingsHover = () => {
    //     setShowMenu(true);
    //   };
    
    //   const handleSettingsClick = () => {
    //     setShowMenu(false);
    //     setShowModal(true);
    //   };
    
    //   const handleMenuLeave = () => {
    //     setShowMenu(false);
    //   };
    

    // return (
    // <>
    //     <div className="ft-category-wrapper">
    //             <div className="ft-icon-circle" style={{border: `5px solid ${iconColor}`, backgroundColor: {categoryBackground}}}>
    //                 <FontAwesomeIcon
    //                     icon={icon}
    //                     size={iconSize}
    //                     color={iconColor}
    //                 />
    //             </div>
    //             <h2 className="ft-category-name">{category}</h2>
    //             <div className="ft-settings-btn" onMouseEnter={handleSettingsHover} onClick={handleSettingsClick} onBlur={handleMenuLeave}>
    //         <FontAwesomeIcon icon={faEllipsisV} size="lg" color="black" />
    //         {showMenu && (
    //             <div className="ft-settings-menu">
    //             <div className="ft-settings-option" onClick={handleSettingsClick}>Settings</div>
    //             </div>
    //         )}
    //         </div>
    //     </div>
    //     {showModal && <div className="modal">Settings modal</div>}
    
    // </>);
    const [showModal, setShowModal] = useState(false);
    const [popoverVisible, setPopoverVisible] = useState(false);
  
    const handleSettingsClick = () => {
      setShowModal(true);
      setPopoverVisible(false);
    };
  
    const handleModalClose = () => {
      setShowModal(false);
    };
  
    const popoverContent = (
      <div className="ft-popover-menu" onMouseEnter={() => setPopoverVisible(true)} onMouseLeave={() => setPopoverVisible(false)}>
        <div className="ft-settings-option" onClick={handleSettingsClick}>Settings</div>
      </div>
    );
  
    return (
      <>
        <div className="ft-category-wrapper">
          <div className="ft-icon-circle" style={{ border: `5px solid ${iconColor}`, backgroundColor: categoryBackground }}>
            <FontAwesomeIcon icon={icon} size={iconSize} color={iconColor} />
          </div>
          <h2 className="ft-category-name">{category}</h2>
          <Popover content={popoverContent} trigger="hover" placement="bottom" open={popoverVisible} onOpenChange={setPopoverVisible} mouseEnterDelay={200} mouseLeaveDelay={200}>
            <div className="ft-settings-btn" onMouseEnter={() => setPopoverVisible(true)}>
              <FontAwesomeIcon icon={faEllipsisV} size="lg" color="black" />
            </div>
          </Popover>
        </div>
        {showModal && <div className="modal">Settings modal <button onClick={handleModalClose}>Close</button></div>}
      </>
    );
  }
// }

