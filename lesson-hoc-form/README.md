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
```



### 实现 my-rc-form

```js
import React, {Component} from "react";

export function createForm(Cmp) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.options = {};
    }
    getFieldsValue = () => {
      return {...this.state};
    };
    getFieldValue = name => {
      return this.state[name];
    };
    handleChange = e => {
      const {name, value} = e.target;
      this.setState({[name]: value});
    };

    setFieldsValue = newStore => {
      this.setState(newStore);
    };

    getFieldDecorator = (fieldName, option) => InputCmp => {
      this.options[fieldName] = option;
      return React.cloneElement(InputCmp, {
        name: fieldName,
        value: this.state[fieldName] || "",
        onChange: this.handleChange
      });
    };

    validateFields = callback => {
      let err = [];
      for (let fieldName in this.options) {
        if (this.state[fieldName] === undefined) {
          err.push({
            [fieldName]: "err"
          });
        }
      }
      if (err.length === 0) {
        callback(null, {...this.state});
      } else {
        callback(err, {...this.state});
      }
    };

    getForm = () => {
      return {
        getFieldsValue: this.getFieldsValue,
        getFieldValue: this.getFieldValue,
        setFieldsValue: this.setFieldsValue,
        getFieldDecorator: this.getFieldDecorator,
        validateFields: this.validateFields
      };
    };
    render() {
      const form = this.getForm();
      return <Cmp {...this.props} form={form} />;
    }
  };
}
```

但是 antd3 的设计有个问题，就是局部变化会引起整体变化，antd4 改进了这个问题。
