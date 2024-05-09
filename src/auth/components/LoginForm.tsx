import React from "react";

import axios from "axios";

interface Form {
  username: string;
  password: string;
}

const LoginForm = () => {
  const [formData, setFormData] = React.useState<Form>({
    username: "",
    password: "",
  });

  const [message, setMessage] = React.useState<string>("");

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { username, password } = formData;

    if (username && password) {
      axios
        .post("http://localhost:5000/api/auth/login", {
          username: username,
          password: password,
        })
        .then((res) => {
          const data: { [key: string]: boolean } = res.data;
          if (res.status === 200 && res.statusText === "OK") {
            if (data && data.accessToken) {
              // Successful login
              setMessage("Correct password!");
              localStorage.setItem("accessToken", data.accessToken.toString());
              window.location.reload();
            }
            if (data && !data.accessToken) {
              // Failed login
              setMessage("Wrong password!");
            }
            if (!data) {
              // User does not exist
              setMessage("User does not exist!");
            }
          }
        })
        .catch((error) => {
          // Fail
          console.log(error);
        })
        .finally(() => {
          // Finally
        });
    }
  };

  return (
    <div className="login-form">
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label>Username</label>
        <input
          autoFocus
          required
          type="text"
          name="username"
          onChange={handleInputChange}
        />

        <label>Password</label>
        <input
          required
          type="password"
          name="password"
          onChange={handleInputChange}
        />

        <button type="submit">Login</button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
