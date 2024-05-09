import React from 'react';

interface Props {
  index: number;
  name: string;
}

export default function App({ index }: Props): JSX.Element {
  React.useEffect(() => {}, []);

  //====================HELPER FUNCTIONS====================//
  // Function expression syntax to save memory
  //====================HELPER FUNCTIONS====================//

  return <div>Child {index}</div>;
}
