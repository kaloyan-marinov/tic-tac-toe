import React from "react";
import { RequestStatus } from "../constants";

export const Register = () => {
  const [username, setUsername] = React.useState("");
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<RequestStatus>(RequestStatus.IDLE);

  console.log("rendering <Register>");
  console.log(submitted);

  React.useEffect(() => {
    if (username !== "") {
      console.log("running fetch");
      fetch("/api/users", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          username,
        }),
      })
        .then((r) => r.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    }
  }, [submitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitted(true);
  };

  return (
    <>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <div>
          <input
            type="text"
            placeholder="Enter username"
            name="username"
            value={username}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <input type="submit" value="Register" />
      </form>
    </>
  );
};
