import OrdersTable from './components/OrdersTable';

import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      {/* <Navbar /> */}
      <OrdersTable />
    </Provider>
  );
}

export default App;
