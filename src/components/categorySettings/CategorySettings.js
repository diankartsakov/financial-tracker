import React, { useState } from "react";
import { Input, Button, Radio } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import IconPickerPopover from "../iconPickerPopover/IconPickerPopover";
import "./categorySettings.css";
import { debounce } from "../../assests/utils/utils";

export default function CategorySettings({onSubmit}) {
    const [categoryName, setCategoryName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState(faCoins);
    const [selectedIconColor, setSelectedIconColor] = useState("#000000");
    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(
      "#FFFFFF"
    );
    const [selectedSize, setSelectedSize] = useState("4x");
  
    console.log("render settings");
    const handleCategoryNameChange = (event) => {
      setCategoryName(event.target.value);
    };
  
    const handleIconSelect = (icon) => {
      setSelectedIcon(icon);
    };
  
    const handleIconColorSelect = (event) => {
        debounce(setSelectedIconColor(event.target.value));
    };
  
    const handleBackgroundColorSelect = (event) => {
        debounce(setSelectedBackgroundColor(event.target.value));
    };
  
    const handleSizeSelect = (event) => {
      setSelectedSize(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
          category: categoryName,
          icon: JSON.stringify(selectedIcon),
          iconColor: selectedIconColor,
          iconSize: selectedSize, 
          categoryBackground: selectedBackgroundColor,
        }
        console.log("Submitted!\n", formData);
        await onSubmit(formData);
        console.log("final");
      };

      return (
        <div className="form-container">
          <div className="form-column">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="category-name">Category Name:</label>
                <Input
                  id="category-name"
                  type="text"
                  value={categoryName}
                  onChange={handleCategoryNameChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="icon">Icon:</label>
                <IconPickerPopover id="icon" onSelect={handleIconSelect} />
              </div>
              <div className="form-group">
                <label htmlFor="size">Size:</label>
                <Radio.Group
                  id="size"
                  value={selectedSize}
                  onChange={handleSizeSelect}
                >
                  <Radio.Button value="2x">XS</Radio.Button>
                  <Radio.Button value="4x">SM</Radio.Button>
                  <Radio.Button value="5x">MD</Radio.Button>
                  <Radio.Button value="7x">LG</Radio.Button>
                </Radio.Group>
              </div>
              <div className="form-group">
                <label htmlFor="icon-color">Icon Color:</label>
                <Input
                  id="icon-color"
                  type="color"
                  value={selectedIconColor}
                  onChange={handleIconColorSelect}
                />
              </div>
              <div className="form-group">
                <label htmlFor="background-color">Background Color:</label>
                <Input
                  id="background-color"
                  type="color"
                  value={selectedBackgroundColor}
                  onChange={handleBackgroundColorSelect}
                />
              </div>
              <Button value="submit" type="primary" htmlType="submit" >
                  Submit
              </Button>
            </form>
          </div>
          <div className="preview-column">
            <div className="category-preview">
              <div className="category-preview-title">Category Preview:</div>
              <div
                className="icon-circle"
                style={{
                  border: `5px solid ${selectedIconColor}`,
                  backgroundColor: selectedBackgroundColor,
                }}
              >
                <FontAwesomeIcon
                  icon={selectedIcon}
                  size={selectedSize}
                  color={selectedIconColor}
                />
              </div>
              <div className="category-name">{categoryName}</div>
              <div className="form-group">
              </div>
            </div>
          </div>
        </div>
      );      
}