# 弹窗类组件设计与实现



## 设计思路

弹窗类组件的要求弹窗内容在 A 处声明，却在 B 处展示。react 中相当于弹窗内容看起来被 render 到一个组件里面去，实际改变的是网页上另一处的 DOM 结构，这个显然不符合正常逻辑。但是通过使用框架提供的特定 API 创建组件实例并指定挂载目标仍可完成任务。

```jsx
// 常见用法如下：Dialog在当前组件声明，但是却在body中另一个div中显示
import React, {Component} from "react";
import Dialog from "../conponents/Dialog";

export default class DialogPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false
    };
  }
  render() {
    const {showDialog} = this.state;
    return (
      <div>
        <h3>DialogPage</h3>
        <button
          onClick={() =>
            this.setState({
              showDialog: !showDialog
            })
          }>
          toggle
        </button>
        {showDialog && <Dialog />}
      </div>
    );
  }
}
```



## 具体实现: Portal

传送门，react v16 之后出现的 portal 可以实现内容传送功能。

范例：Dialog 组件

```jsx
// Diallog.js
import React, {Component} from "react";
import {createPortal} from "react-dom";

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    const doc = window.document;
    this.node = doc.createElement("div");
    doc.body.appendChild(this.node);
  }
  componentWillUnmount() {
    window.document.body.removeChild(this.node);
  }
  render() {
    const {hideDialog} = this.props;
    return createPortal(
      <div className="dialog">
        {this.props.children}
        {typeof hideDialog === "function" && (
          <button onClick={hideDialog}>关掉弹窗</button>
        )}
      </div>,
      this.node
    );
  }
}
```

```scss
.dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  line-height: 30px;
  width: 400px;
  height: 300px;
  transform: translate(50%, 50%);
  border: solid 1px gray;
  text-align: center;
}
```

> 总结一下：
>
> Dialog 做得事情是通过调用 createPortal 把要画的东西画在 DOM 树上另一个角落。
