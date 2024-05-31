export default async (): Promise<unknown> => {
  let data: unknown;

  try {
    const response = await fetch(
      // `http://localhost:8080/api/orders`,
      // `https://api.thecatapi.com/v1/breeds`,
      `https://dinosaur-facts-api.shultzlab.com/dinosaurs`,
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
  // prettier-ignore
  return [ { key1: 1, key2: 'Value 1', }, { key1: 2, key2: 'Value 2', }, ];
  return data;
};
