import { useState } from 'react';
import { Popover, Button } from 'antd';
import { icons } from './icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function IconPickerPopover({ onSelect }) {
  const [visible, setVisible] = useState(false);
  
  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };
  
  const handleIconSelect = (icon) => {
    onSelect(icon);
    setVisible(false);
  };
  
  return (
    <Popover
      open={visible}
      onOpenChange={handleVisibleChange}
      content={
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '300px' }}>
          {icons.map((icon) => (
            <div
              key={icon.iconName}
              style={{ cursor: 'pointer', margin: '5px'}}
              onClick={() => handleIconSelect(icon.icon)}
            >
              <FontAwesomeIcon icon={icon.icon} /> {icon.iconName}
            </div>
          ))}
        </div>
      }
    >
      <Button style={{width: "250px"}}>Choose Icon</Button>
    </Popover>
  );
}