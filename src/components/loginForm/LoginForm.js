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
        login(email.trim(), password)
            .then(() => {
                navigate('/dashboard');
            })
            .catch(error => {
                setIsError(true);
                const errorCode = error.code;
                if (errorCode.includes("auth/")) {
                    setErrorMessage("Wrong credentials!");
                } else {
                    setErrorMessage("Something went wrong... Try Again!");
                }
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
                                pattern: /^\s*\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+\s*$/,
                                message: 'Please enter a valid Email'
                            }
                        ]}
                    >
                        <Input className='ft-login-input ft-login-email' maxLength={30} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email Address" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        validateTrigger="onBlur"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            }
                        ]}
                    >
                        <Input.Password
                            className='ft-login-input ft-login-password'
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            maxLength={15}
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