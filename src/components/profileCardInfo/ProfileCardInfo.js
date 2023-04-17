import { Card} from 'antd';


export default function ProfileCardInfo({title, content}) {
    return (<>
        <Card title={title} bordered={false} className='ft-profile-card'>
            {content}
        </Card>
    </>);
}