import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/firebaseAuthenticationManager";
import { Button, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import "./RegisterForm.scss";
import { useState } from 'react';
import AlertMessage from '../alertMessage/AlertMessage';
import { useAuth } from "../../firebase/auth";
import { addCategory } from "../../services/firebaseFirestoreCategories";
import { categories } from "../../assests/utils/newUsersData";

export default function RegisterForm() {
    const { authUser} = useAuth();
    const [isSentToServer, setIsSentToServer] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = (values) => {
        const {email, password} = values;
        setIsSentToServer(true);
        register(email.trim(), password)
            .then(() => {
                categories.map(category => {
                    addCategory(category);
                })
                navigate("/dashboard");
            })
            .catch((error) => {
                setIsError(true);
                const errorCode = error.code;
                setErrorMessage(errorCode);
            })
            .finally(() => setIsSentToServer(false));
  };
  
  return (
    <div className="registerContainer">
      <div className="registerFormDiv">
        <h3>Register</h3>
        {isError && <AlertMessage type="error" description={errorMessage}/>}
        <Form
            form={form}
          name="normal_register"
          className="register-form"
          onFinish={onFinish}
        //   onFinishFailed={onFinishFailed}
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
            <Input className='ft-register-input ft-register-email' maxLength={30} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email Address"/>
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
                    pattern: /^\S{6,}$/,
                    message: 'Password must be at least 6 characters long. No spaces allowed.'
                },
            ]}
          >
            <Input.Password className='ft-register-input ft-register-password' prefix={<LockOutlined className="site-form-item-icon" />}
            type="password" maxLength={15} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            validateTrigger="onBlur"

            rules={[
                {
                    required: true,
                    message: 'Please input your Password!',
                },
                {
                    min: 6,
                    pattern: /^\S{6,}$/,
                    message: 'Password must be at least 6 characters long. No spaces allowed.'
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
            ]}
          >
             <Input.Password className='ft-register-input ft-register-password' prefix={<LockOutlined className="site-form-item-icon" />}
            type="password" maxLength={15} placeholder="Confirm Password" />
          </Form.Item>

            <div className='split-line'></div>
            <Form.Item>
                <Link className="login-form-forgot" to="/login">
                    Already have an account?
                </Link>
            </Form.Item>

          <Form.Item id="registerButtonWrapper">
            <Button type="primary" className="login-form-button" id="registerButton" htmlType="submit">
                {isSentToServer ? "Loading..." : "Register"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
