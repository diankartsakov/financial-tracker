import React, { useEffect, useState } from "react";
import { Input, Button, Radio, Form} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
} from "@fortawesome/free-solid-svg-icons";
import IconPickerPopover from "../iconPickerPopover/IconPickerPopover";
import "./categorySettings.scss";
import { debounce } from "../../assests/utils/utils";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { getUserCategories } from "../../services/firebaseFirestoreCategories";

export default function CategorySettings({
    onSubmit,
    onCancel, onError: {setError},
    resetForm: {resetForm, setResetForm},
    initialData = {
      category: "",
      icon: faCoins,
      iconColor: "#000000",
      iconSize: "4x", 
      categoryBackground: "#FFFFFF",
    }
  }
  
  ) {
    const [categoryName, setCategoryName] = useState(initialData.category);
    const [selectedIcon, setSelectedIcon] = useState(initialData.icon);
    const [selectedIconColor, setSelectedIconColor] = useState(initialData.iconColor);
    const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(initialData.categoryBackground);
    const [selectedSize, setSelectedSize] = useState(initialData.iconSize);
    const {categories, updateCategories} = useDash();
    
    // console.log(initialData);
    // console.log(categoryName);
    useEffect(() => {
      if (resetForm) {
        setCategoryName(initialData.category);
        setSelectedIcon(faCoins);
        setSelectedIconColor("#000000");
        setSelectedBackgroundColor("#FFFFFF");
        setSelectedSize("4x");
        setResetForm(false);
      }
    });

    const handleCategoryNameChange = (event) => {
      let categoryName = event.target.value;
      setCategoryName(categoryName);  
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

    const handleSubmit = async () => {
        const formData = {
          category: categoryName,
          icon: JSON.stringify(selectedIcon),
          iconColor: selectedIconColor,
          iconSize: selectedSize, 
          categoryBackground: selectedBackgroundColor,
        }

        if (categoryName.trim().length === 0 || categoryName.trim().length > 15 ) {
          setError("Your Category Name is invalid. Valid name is from 1 to 15 characters")
        }

        const submitResult = await onSubmit(formData, initialData.id);

        if (submitResult?.error) {
            setError(submitResult);
        } else {
          const arr = initialData.id ? await getUserCategories() : [...categories, submitResult];
          updateCategories(arr);
          setError("");

          onCancel()
        }
      };

      // const categoryValidationRules = [
      //   { 
      //     required: true, 
      //     message: 'Please enter a category name' 
      //   },
      //   {
      //     pattern: /^(?=.*[a-zA-Z])[a-zA-Z\s]{1,15}$/,
      //     message: 'Valid name is from 1 to 15 characters, only Latin letters are allowed.'
      //   }
      // ];

      return (
        <div className="form-container">
          <div className="form-column">
            <Form onFinish={handleSubmit} initialValues={{ 'category-name': categoryName }}>
              <div className="form-group">
                <label htmlFor="category-name">Category Name:</label>
                                  
                <Input
                      id="category-name"
                      type="text"
                      maxLength={15}
                      value={categoryName}
                      onChange={handleCategoryNameChange}
                    />
                {/* <Form.Item
                  name="category-name"
                  rules={categoryValidationRules}
                  className="ft-category-name-input"
                >
                  
                    <Input
                      id="category-name"
                      type="text"
                      maxLength={15}
                      value={categoryName}
                      onChange={handleCategoryNameChange}
                    />
            
                </Form.Item> */}
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
            </Form>
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