import { Component } from 'react';

interface IProps {
  index: number;
}

export default class ChildComponent extends Component<IProps> {
  render() {
    return <div>Child {this.props.index}</div>;
  }
}
