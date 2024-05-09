interface Props {
  name: string;
  age?: number;
}

const Boilerplate = ({ name, age }: Props) => {
  return (
    <div>
      <p>Name: {name}</p>
      {age != null && <p>Age: {age}</p>}
    </div>
  );
};

Boilerplate.defaultProps = {
  age: 18,
};

export default Boilerplate;
