import React, {Component} from "react";

// hoc
// 是个函数, 参数是组件, 返回值是个新的组件

const foo = Cmp => props => {
  return (
    <div className="border">
      <Cmp {...props} omg="omg" />
    </div>
  );
};

function Child(props) {
  return <div>Child</div>;
}

const Foo = foo(foo(foo(Child)));

@foo
@foo
class ClassChild extends Component {
  render() {
    return <div>ClassChild</div>;
  }
}

export default class HocPage extends Component {
  render() {
    return (
      <div>
        <h3>HocPage</h3>
        <Foo />
        <ClassChild />
      </div>
    );
  }
}
