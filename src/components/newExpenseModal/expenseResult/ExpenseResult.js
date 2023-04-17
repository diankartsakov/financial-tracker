import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

export default function ExpenseResult({ok, message, onCancel}) {

    return (
        <>
            {
                    ok
                ?
                    <Result
                        status="success"
                        title={message}
                        extra={[
                        <Link to="/dashboard/reports">
                            <Button type="primary" key="console">
                                To Reports
                            </Button>                       
                        </Link>,
                        <Button key="close" onClick={onCancel}>To Expense</Button>,
                        ]}
                    />
                :
                    <Result
                        status="error"
                        title={message}
                        subTitle="Try again..."
                        extra={[
                            <Button key="close" onClick={onCancel}>Close</Button>,
                        ]}
                    />
            }
        </>
    )

}