import React, {Component} from "react";
import Input from "../components/Input";
// import {createForm} from "rc-form";
import {createForm} from "../components/my-rc-form/";

const nameRules = {required: true, message: "请输入姓名！"};
const passworRules = {required: true, message: "请输入密码！"};

@createForm
class MyRCForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  componentDidMount() {
    const {setFieldsValue} = this.props.form;
    setFieldsValue({username: "default"});
  }

  submit = () => {
    // const {username, password} = this.state;
    const {getFieldsValue, getFieldValue, validateFields} = this.props.form;
    console.log("syta", getFieldsValue(), getFieldValue("username")); //sy-log

    validateFields((err, vals) => {
      if (err) {
        console.log("失败", err); //sy-log
      } else {
        console.log("成功", vals); //sy-log
      }
    });
  };

  render() {
    const {username, password} = this.state;
    console.log("props", this.props); //sy-log

    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <h3>MyRCForm</h3>
        {getFieldDecorator("username", {rules: [nameRules]})(
          <Input placeholder="Username" />
        )}
        {getFieldDecorator("password", {rules: [passworRules]})(
          <Input placeholder="Password" />
        )}
        <button onClick={this.submit}>submit</button>
      </div>
    );
  }
}

export default MyRCForm;

// form state
