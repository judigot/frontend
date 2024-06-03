import React from 'react';

interface IProps {
  index: number;
  name: string;
}

export default function App({ index }: IProps): JSX.Element {
  React.useEffect(() => {}, []);

  //====================HELPER FUNCTIONS====================//
  // Function expression syntax to save memory
  //====================HELPER FUNCTIONS====================//

  return <div>Child {index}</div>;
}
