import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword} from "firebase/auth"
import { Button, Form, Input } from "antd";
import "./RegisterForm.css";
import { redirect, useNavigate } from "react-router-dom";




export default function RegisterForm() {
    const onFinish = (values) => {
        const {email, password} = values;
    
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                redirect("/home");
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
