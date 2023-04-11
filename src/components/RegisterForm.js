import { useNavigate } from "react-router-dom";
import { register } from "../services/firebaseAuthenticationManager";
import { Button, Form, Input } from "antd";
import "./RegisterForm.css";





export default function RegisterForm() {
    const navigate = useNavigate();

    const onFinish = (values) => {
        const {email, password} = values;
    
        register(email, password)
            .then(() => {
                navigate("/dashboard");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(`${errorCode} - ${errorMessage}`);
            })
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="registerContainer">
      <div className="registerFormDiv">
        <h3>Register</h3>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "That is not valid Email!",
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="rePassword"
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item id="registerButtonWrapper">
            <Button type="primary" id="registerButton" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
