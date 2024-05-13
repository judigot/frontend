export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export default async () => {
  let data: User | User[] | undefined = undefined;

  try {
    const response = await fetch(`http://localhost:5000/api/users`, {
      // *GET, POST, PATCH, PUT, DELETE
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*', // Same as axios
        'Content-Type': 'application/json',
      },
      // For POST/PUT requests
      // body: JSON.stringify({ key: "value" }),
    });
    if (response.ok) {
      data = response.json() as unknown as User;
    } else {
      throw new Error(`HTTP error: ${String(response)}`);
    }
  } catch (error: unknown) {
    if (typeof error === `string`) {
      throw new Error(`There was an error: ${error}`);
    }
    if (error instanceof Error) {
      throw new Error(`There was an error: ${error.message}`);
    }
    if (error instanceof SyntaxError) {
      // Unexpected token < in JSON
      throw new Error(`Syntax Error: ${String(error)}`);
    }
  }

  // Success
  if (data) {
    return data;
  }
};
