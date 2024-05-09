import { Component, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';

// Define the types for the props that CountryList expects
interface CountryListProps {
  countries: Array<
    | string
    | number
    | boolean
    | ReactElement
    | Iterable<ReactNode>
    | ReactPortal
    | null
    | undefined
  >;
}

class CountryList extends Component<CountryListProps> {
  render() {
    return (
      <Paper>
        <List>
          {this.props.countries.map(
            (
              element:
                | string
                | number
                | boolean
                | ReactElement
                | Iterable<ReactNode>
                | ReactPortal
                | null
                | undefined,
              i: Key | null | undefined,
            ) => {
              return (
                <ListItem key={i as React.Key}>
                  <ListItemText primary={element} />
                </ListItem>
              );
            },
          )}
        </List>
      </Paper>
    );
  }
}

export default CountryList;
