import axios from 'axios';

import AxiosInterceptor from './AxiosInterceptor';

AxiosInterceptor;

interface IAuthResponse {
  user: Record<string, string>;
  redirect: string;
}

// Check if user is logged in
const auth = async () => {
  try {
    const {
      data: { user },
      status,
      statusText,
    } = await axios.post<IAuthResponse>(
      'http://localhost:5000/api/auth/authorize',
    );
    if (status === 200 && statusText === 'OK') {
      return user;
    }
  } catch (error: unknown) {
    if (typeof error === `string`) {
      throw new Error(error);
    }
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export default auth;
