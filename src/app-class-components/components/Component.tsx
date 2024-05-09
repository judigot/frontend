import { Component } from 'react';

interface Props {
  index: number;
}

export default class ChildComponent extends Component<Props> {
  render() {
    return <div>Child {this.props.index}</div>;
  }
}
