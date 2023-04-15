import { Result } from 'antd';
import { Link } from 'react-router-dom';

export default function NotAuthorizedPage() {
   return <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={<Link to="/home" type="primary">Back Home</Link>}
  />
}
