export default async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/orders`, {
      // *GET, POST, PATCH, PUT, DELETE
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*", // Same as axios
        "Content-Type": "application/json",
      },
      // For POST/PUT requests
      // body: JSON.stringify({ key: "value" }),
    });
    if (response?.ok) {
      return response.json();
    } else {
      throw new Error(`HTTP error: ${response}`);
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
      throw new Error(`Syntax Error: ${error}`);
    }
  } finally {
  }
};
