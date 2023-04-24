import {  QuestionCircleOutlined  } from "@ant-design/icons";
import "./deletePopconfirm.scss"
import {  Button, Popconfirm  } from "antd";

export default function DeletePopconfirm({onConfirm, name}) {
    return (<Popconfirm
    title="Delete the category"
    description={`Are you sure to delete "${name}" category?`}
    onConfirm={onConfirm}
    icon={
      <QuestionCircleOutlined
        style={{
          color: 'red',
        }}
      />
    }
  >
    <p className="ft-setting-option-pop" type="link">Delete</p>
    {/* <Button type="link">Delete</Button> */}
  </Popconfirm>
);
}