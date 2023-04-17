import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/firebaseAuthenticationManager';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input,} from 'antd';
import './LoginForm.scss';
import { useState } from 'react';
import AlertMessage from '../alertMessage/AlertMessage';

export default function LoginForm() {
    const [isSentToServer, setIsSentToServer] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();


    const onFinish = (values) => {
        const {email, password} = values;
        setIsSentToServer(true);
        login(email, password)
            .then(() => {
                navigate('/dashboard');
            })
            .catch(error => {
                setIsError(true);
                const errorCode = error.code
                if (errorCode.includes("auth/")) {
                    setErrorMessage("Wrong credentials!");
                } else {
                    setErrorMessage("Something went wrong... Try Again!");
                }
                console.log(typeof error.code);
                console.log(error.code);
            })
            .finally(() => setIsSentToServer(false));
    };

    return (
        <div className='loginContainer'>
            <div className='loginFormDiv'>
                <h3>Login</h3>
                {isError && <AlertMessage type="error" description={errorMessage}/>}
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        validateTrigger="onBlur"
                        rules={[
                            {
                                required: true,
                                message: 'Email is required',
                            },
                            { 
                                pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                message: 'Please enter a valid Email'
                            }
                        ]}
                    >
                        <Input className='ft-login-input ft-login-email' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email Address" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        validateTrigger="onBlur"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                            {
                                min: 6,
                                message: 'Password must be at least 6 characters long.'
                            }
                        ]}
                    >
                        <Input.Password
                            className='ft-login-input ft-login-password'
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <div className='split-line'></div>
                    <Form.Item>
                        <Link className="login-form-forgot" to="/register">
                            Don't have an account yet? 
                        </Link>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            {isSentToServer ? "Loading..." : "Log in"}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};




// const LoginForm = () => {
//   const [form] = Form.useForm();
//   const [alertVisible, setAlertVisible] = useState(false);
//   const [alertText, setAlertText] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleValidation = debounce((rule, value) => {
//     if (!value) {
//       rule.message = 'Please enter your email address';
//       form.setFields([{ name: 'email', errors: [rule.message] }]);
//     } else if (!/\S+@\S+\.\S+/.test(value)) {
//       rule.message = 'Please enter a valid email address';
//       form.setFields([{ name: 'email', errors: [rule.message] }]);
//     } else {
//       form.setFields([{ name: 'email', errors: [] }]);
//     }
//   }, 500);

//   const handlePasswordValidation = debounce((rule, value) => {
//     if (!value) {
//       rule.message = 'Please enter your password';
//       form.setFields([{ name: 'password', errors: [rule.message] }]);
//     } else if (value.length < 6) {
//       rule.message = 'Password must be at least 6 characters long';
//       form.setFields([{ name: 'password', errors: [rule.message] }]);
//     } else {
//       form.setFields([{ name: 'password', errors: [] }]);
//     }
//   }, 500);

//   const handleSubmit = async (values) => {
//     setLoading(true);
//     // Check if email and password are valid
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const passwordRegex = /^.{6,}$/;
//     if (!emailRegex.test(values.email) || !passwordRegex.test(values.password)) {
//       setAlertText('Please enter a valid email and password (password must be at least 6 characters long)');
//       setAlertVisible(true);
//       setLoading(false);
//     } else {
//       try {
//         // Submit form to server here
//         console.log(values);
//         setLoading(false);
//       } catch (error) {
//         console.log(error);
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="loginContainer">
//       <div className="loginFormDiv">
//         <h3>Login</h3>
//         {alertVisible && <Alert message={alertText} type="error" showIcon />}
//         <Spin spinning={loading}>
//           <Form form={form} onFinish={handleSubmit}>
//             <Form.Item
//               name="email"
//               rules={[
//                 {
//                   required: true,
//                   validator: handleValidation,
//                 },
//               ]}
//             >
//               <Input prefix={<UserOutlined />} placeholder="Email Address" />
//             </Form.Item>
//             <Form.Item
//               name="password"
//               rules={[
//                 {
//                   required: true,
//                   validator: handlePasswordValidation,
//                 },
//               ]}
//             >
//               <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
//             </Form.Item>
//             <Form.Item>
//               <Form.Item name="remember" valuePropName="checked" noStyle>
//                 <Checkbox>Remember me</Checkbox>
//               </Form.Item>

//               <a className="login-form-forgot" href="/login">
//                 Forgot password?
//               </a>
//               </Form.Item>

//         <Form.Item>
//         <Button type="primary" htmlType="submit" className="login-form-button">
//             Log in
//         </Button>
//         Or <a href="/register">register now!</a>
//         </Form.Item>
//         </Form>
//         </Spin>
//         </div>
//         </div>
//   )}

//   export default LoginForm

