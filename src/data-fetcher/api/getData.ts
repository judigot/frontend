export default async (): Promise<unknown> => {
  let data: unknown;

  const page = 1;
  const limit = 100;
  const search = '';

  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/users?page=${String(page)}&limit=${String(limit)}&search=${encodeURIComponent(search)}`,
      // `http://localhost:5000/api/v1/users`,
      // `http://localhost:8080/api/orders`,
      // `https://api.thecatapi.com/v1/breeds`,
      // `https://dinosaur-facts-api.shultzlab.com/dinosaurs`,
      // `https://jsonplaceholder.typicode.com/users`,
      {
        // *GET, POST, PATCH, PUT, DELETE
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*', // Same as axios
          'Content-Type': 'application/json',
        },
        // For POST/PUT requests
        // body: JSON.stringify({ key: "value" }),
      },
    );
    if (response.ok) {
      data = response.json();
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
  return data;
};
