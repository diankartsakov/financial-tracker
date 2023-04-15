import {  QuestionCircleOutlined  } from "@ant-design/icons";
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
    <Button type="link">Delete</Button>
  </Popconfirm>
);
}