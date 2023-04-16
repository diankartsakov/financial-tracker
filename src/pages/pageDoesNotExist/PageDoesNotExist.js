import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

export default function PageDoesNotExist() {
   return <Result
   style = {{marginTop: "100px"}}
   status="404"
   title="404"
   subTitle="Sorry, the page you visited does not exist."
   extra={<Link to="/home" type="primary">Back Home</Link>}
   />
}
