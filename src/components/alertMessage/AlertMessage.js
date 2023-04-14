import { Alert } from "antd"; 

export default function AlertMessage({description, type}) {
    return (<Alert
    description={description}
    type={type}
  />)

}