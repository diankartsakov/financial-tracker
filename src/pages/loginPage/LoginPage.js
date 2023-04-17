import LoginForm from '../../components/loginForm/LoginForm';
import "./loginPage.scss";
import loginLogo from "../../assests/images/loginFormPNG.png"

export default function LoginPage () {
    return (<>
        <div className='ft-login-wrapper'>
            <div className='ft-login-logo-wrapper'>
                <img src={loginLogo} alt=""/>
            </div>
            <LoginForm></LoginForm>
        </div>
    </>);
}