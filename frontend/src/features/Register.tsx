import React from "react";
import { Redirect } from "react-router-dom";
import { RequestStatus } from "../constants";

export const Register = () => {
  const [username, setUsername] = React.useState("");
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<RequestStatus>(RequestStatus.IDLE);

  console.log("rendering <Register>");
  console.log(submitted);

  React.useEffect(() => {
    if (username !== "") {
      setStatus(RequestStatus.LOADING);

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
        .then((r) => {
          setStatus(r.ok === true ? RequestStatus.SUCCEEDED : RequestStatus.FAILED);
          return r.json();
        })
        .then((data) => console.log(data))
        .catch((err) => {
          setStatus(RequestStatus.FAILED);
          console.error(err);
        });
    }
  }, [submitted]);

  if (status === RequestStatus.FAILED) {
    setSubmitted(false);
  }

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
        <input
          type="submit"
          value="Register"
          disabled={status === RequestStatus.LOADING}
        />
      </form>
      {status === RequestStatus.SUCCEEDED ? (
        <div>Registration successful. Please log in.</div>
      ) : (
        <div></div>
      )}
    </>
  );
};
