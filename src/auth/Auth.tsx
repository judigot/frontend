import LoginForm from './components/LoginForm';
import User from './components/User';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Authorization from './utils/Authorization';

type Payload = Record<string, string | number>;

// Conditional rendering based whether if the user is authenticated or not
const user: Payload = (await Authorization()) as unknown as Payload;

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/user" replace /> : <LoginForm />}
        />
        <Route
          path="/user"
          element={
            !user ? <Navigate to="/login" replace /> : <User payload={user} />
          }
        />

        <Route path="/dashboard" element={<h1>Dashboard</h1>} />

        {/*=====404=====*/}
        <Route
          path="/*"
          element={user ? <User payload={user} /> : <LoginForm />}
        />
        {/*=====404=====*/}
      </Routes>
    </BrowserRouter>
  );
}
