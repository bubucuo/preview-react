# 高阶组件-HOC

​ 为了提高组件复用率，可测试性，就要保证组件功能单一性；但是若要满足复杂需求就要扩展功能单一的组件，在 React 里就有了 HOC（Higher-Order Components）的概念。

​ 定义：**高阶组件是参数为组件，返回值为新组件的函数。**

## 基本使用

```jsx
// HocPage.js
import React, {Component} from "react";

// hoc: 是一个函数，接收一个组件，返回另外一个组件
//这里大写开头的Cmp是指function或者class组件
const foo = Cmp => props => {
  return (
    <div className="border">
      <Cmp {...props} />
    </div>
  );
};

// const foo = Cmp => {
//   return props => {
//     return (
//       <div className="border">
//         <Cmp {...props} />
//       </div>
//     );
//   };
// };

function Child(props) {
  return <div> Child {props.name}</div>;
}

const Foo = foo(Child);
export default class HocPage extends Component {
  render() {
    return (
      <div>
        <h3>HocPage</h3>
        <Foo name="msg" />
      </div>
    );
  }
}
```

## 链式调用

```jsx
// HocPage.js
import React, {Component} from "react";

// hoc: 是一个函数，接收一个组件，返回另外一个组件
//这里大写开头的Cmp是指function或者class组件
const foo = Cmp => props => {
  return (
    <div className="border">
      <Cmp {...props} />
    </div>
  );
};
const foo2 = Cmp => props => {
  return (
    <div className="greenBorder">
      <Cmp {...props} />
    </div>
  );
};

// const foo = Cmp => {
//   return props => {
//     return (
//       <div className="border">
//         <Cmp {...props} />
//       </div>
//     );
//   };
// };

function Child(props) {
  return <div> Child {props.name}</div>;
}

const Foo = foo2(foo(foo(Child)));
export default class HocPage extends Component {
  render() {
    return (
      <div>
        <h3>HocPage</h3>
        <Foo name="msg" />
      </div>
    );
  }
}
```

## 装饰器写法

### 配置 craco 与 antd 与 less

当然如果你不需要 antd 与 less，就不安装就行了。详情参考https://ant.design/docs/react/use-with-create-react-app-cn。

`yarn add antd @craco/craco craco-less`

### 配置装饰器

高阶组件本身是对装饰器模式的应用，自然可以利用 ES7 中出现的装饰器语法来更优雅的书写代码。

- `yarn add @babel/plugin-proposal-decorators`

添加 craco.config.js 文件

```js
//配置完成后记得重启下
const { addDecoratorsLegacy } = require("customize-cra");

module.exports = override(
  ...,
  addDecoratorsLegacy()//配置装饰器
);
```

_如果 vscode 对装饰器有 warning，vscode 设置里加上 `javascript.implicitProjectConfig.experimentalDecorators": true`_

```jsx
//HocPage.js
//...
// !装饰器只能用在class上
// 执行顺序从下往上
@foo2
@foo
@foo
class Child extends Component {
  render() {
    return <div> Child {this.props.name}</div>;
  }
}

// const Foo = foo2(foo(foo(Child)));
export default class HocPage extends Component {
  render() {
    return (
      <div>
        <h3>HocPage</h3>
        {/* <Foo name="msg" /> */}
        <Child />
      </div>
    );
  }
}
```

组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。

HOC 在 React 的第三方库中很常见，例如 React-Redux 的 connect，我们下节课就会学到。

## 使用 HOC 的注意事项

高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

- ### 不要在 render 方法中使用 HOC

  React 的 diff 算法（称为协调）使用组件标识来确定它是应该更新现有子树还是将其丢弃并挂载新子树。 如果从 `render` 返回的组件与前一个渲染中的组件相同（`===`），则 React 通过将子树与新子树进行区分来递归更新子树。 如果它们不相等，则完全卸载前一个子树。

  ```jsx
  render() {
    // 每次调用 render 函数都会创建一个新的 EnhancedComponent
    // EnhancedComponent1 !== EnhancedComponent2
    const EnhancedComponent = enhance(MyComponent);
    // 这将导致子树每次渲染都会进行卸载，和重新挂载的操作！
    return <EnhancedComponent />;
  }
  ```

  这不仅仅是性能问题 - 重新挂载组件会导致该组件及其所有子组件的状态丢失。
