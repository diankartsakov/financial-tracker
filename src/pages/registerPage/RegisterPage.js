import RegisterForm from '../../components/registerForm/RegisterForm';
import "./registerPage.scss";
import registerLogo from "../../assests/images/imageedit_7_7773866332.png";
export default function RegisterPage () {


    return (
        <>
            <div className='ft-register-wrapper'>
            <div className='ft-register-logo-wrapper'>
                <img src={registerLogo} alt=""/>
            </div>
                <RegisterForm></RegisterForm>
            </div>
            
        </>
    );
}