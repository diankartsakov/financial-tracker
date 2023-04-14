import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./expenseCategory.css";
export default function ExpenseCategory({data: {
    id, category, categoryBackground, icon, iconColor, iconSize,
}}) {
    return (
        <div className="ft-category-wrapper">
            <div className="ft-icon-circle" style={{border: `5px solid ${iconColor}`, backgroundColor: {categoryBackground}}}>
                <FontAwesomeIcon
                    icon={icon}
                    size={iconSize}
                    color={iconColor}
                />
            </div>
            <h2 className="ft-category-name">{category}</h2>
        </div>
    );
}

