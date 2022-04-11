import React from "react";

export const Login = () => {
  const [username, setUsername] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <>
      <form>
        <div>
          <input
            type="text"
            placeholder="Enter username"
            name="username"
            value={username}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <input type="submit" value="Log in" />
      </form>
    </>
  );
};
