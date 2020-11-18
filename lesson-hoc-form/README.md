# 高阶组件版表单组件设计思路



## 资源 

[rc-form源码](https://github.com/react-component/form)



## 知识点

- 表单组件要求实现**数据收集、校验、提交**等特性，可通过高阶组件扩展
- 高阶组件给表单组件传递一个 input 组件**包装函数**接管其输入事件并统一管理表单数据
- 高阶组件给表单组件传递一个**校验函数**使其具备数据校验功能



### 例子

```jsx
import React, {Component} from "react";
// import {createForm} from "rc-form";
import createForm from "../components/my-rc-form/";

import Input from "../components/Input";

const nameRules = {required: true, message: "请输入姓名！"};
const passworRules = {required: true, message: "请输入密码！"};

@createForm
class MyRCForm extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   username: "",
    //   password: ""
    // };
  }

  componentDidMount() {
    this.props.form.setFieldsValue({username: "default"});
  }

  submit = () => {
    const {getFieldsValue, validateFields} = this.props.form;
    // console.log("submit", getFieldsValue()); //sy-log
    validateFields((err, val) => {
      if (err) {
        console.log("err", err); //sy-log
      } else {
        console.log("校验成功", val); //sy-log
      }
    });
  };

  render() {
    console.log("props", this.props); //sy-log
    // const {username, password} = this.state;
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
```



### 实现 my-rc-form

```js
import React, {Component} from "react";

export default function createForm(Cmp) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.options = {};
    }

    handleChange = e => {
      const {name, value} = e.target;
      this.setState({[name]: value});
    };

    getFieldDecorator = (field, option) => InputCmp => {
      this.options[field] = option;
      return React.cloneElement(InputCmp, {
        name: field,
        value: this.state[field] || "",
        onChange: this.handleChange
      });
    };
    setFieldsValue = newStore => {
      this.setState(newStore);
    };
    getFieldsValue = () => {
      return this.state;
    };
    validateFields = callback => {
      // 自己想象吧~
    };
    getForm = () => {
      return {
        form: {
          getFieldDecorator: this.getFieldDecorator,
          setFieldsValue: this.setFieldsValue,
          getFieldsValue: this.getFieldsValue,
          validateFields: this.validateFields
        }
      };
    };
    render() {
      return <Cmp {...this.props} {...this.getForm()} />;
    }
  };
}
```

但是 antd3 的设计有个问题，就是局部变化会引起整体变化，antd4 改进了这个问题。
