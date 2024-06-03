import React from 'react';
import styled from 'styled-components';

import ChildComponent from './components/Component';
import Data from './utils/Data';

interface IProps {
  counter?: number;
}

type State = {
  count: number;
  data?: object | string;
};

export default class ExampleComponent extends React.Component<IProps, State> {
  static defaultProps = {
    counter: 1000,
  };

  constructor(props: IProps) {
    super(props);
    this.state = { count: 0, data: 'Loading' };
  }

  async componentDidMount() {
    const data: object | undefined = await Data();
    this.setState({ data });
  }

  componentDidUpdate(_prevProps: IProps, prevState: State) {
    if (this.state.count !== prevState.count) {
      
      console.log('Count state has changed.');
    }
  }

  componentWillUnmount() {
    
    console.log('Component will be removed from the DOM');
  }

  handleClick = () => {
    if (this.state.count !== 5) {
      this.setState((state) => ({ count: state.count + 1 }));
    }
  };

  render() {
    const { count, data } = this.state;

    const H1Styled = styled.h1`
      color: blue;
    `;

    return (
      <>
        <H1Styled>Styled Class Component</H1Styled>
        <h5>Initial Data:</h5>
        <p>{JSON.stringify(data)}</p>
        <button onClick={this.handleClick}>
          You&apos;ve clicked {count} times.
        </button>
        <div>
          {Array.from({ length: count }, (_, i) => (
            <ChildComponent key={i} index={i + 1} />
          ))}
        </div>
      </>
    );
  }
}
