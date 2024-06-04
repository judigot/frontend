interface IProps {
  index: number;
  name: string;
}

export default function App({ index }: IProps) {
  //====================HELPER FUNCTIONS====================//
  // Function expression syntax to save memory
  //====================HELPER FUNCTIONS====================//

  return <div>Child {index}</div>;
}
