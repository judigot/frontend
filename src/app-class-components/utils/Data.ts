export default async () => {
  let data: object | object[] | undefined = undefined;

  try {
    const response = await fetch(`https://api.quotable.io/random`, {
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
  if (data) {
    return data;
  }
};
