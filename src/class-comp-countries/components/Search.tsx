import { Component } from 'react';
import Input from '@mui/material/Input';

// Define an interface for the expected props
interface ISearchProps {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Typing the handleChange to match expected usage
}

class Search extends Component<ISearchProps> {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  constructor(props: ISearchProps) {
    super(props);

    // Assign handleChange from props to an instance variable
    this.handleChange = props.handleChange;
  }

  render() {
    return (
      <Input
        onChange={this.handleChange}
        className="search-box"
        placeholder="Enter Country Name"
      />
    );
  }
}

export default Search;
