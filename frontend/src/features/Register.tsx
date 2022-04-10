import React from "react";
import { Redirect } from "react-router-dom";
import {
  ActionAlerts,
  ActionCreateUser,
  alertsCreate,
  createUser,
  IState,
  selectHasValidToken,
} from "../types";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";

export const Register = () => {
  const [username, setUsername] = React.useState("");

  const hasValidToken: boolean | null = useSelector(selectHasValidToken);
  console.log("    hasValidToken:");
  console.log(`    ${hasValidToken}`);

  const dispatch: ThunkDispatch<IState, unknown, ActionCreateUser | ActionAlerts> =
    useDispatch();

  if (hasValidToken === true) {
    const nextURL: string = "/";
    console.log(`    hasValidToken=${hasValidToken} > redirecting to ${nextURL} ...`);
    return <Redirect to={nextURL} />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const id: string = uuidv4();
    if (username === "") {
      const message: string = "YOU MUST FILL OUT ALL FORM FIELDS";
      dispatch(alertsCreate(id, message));
    } else {
      // Note to self:
      // doing anything beyond simple `console.log` calls in this `else` clause
      // should be postponed until
      // after the logic within the `if` clause has been _properly_ implemented.
      try {
        await dispatch(createUser(username));

        dispatch(alertsCreate(id, "REGISTRATION SUCCESSFUL"));
      } catch (thunkActionError) {
        dispatch(alertsCreate(id, thunkActionError));
      }
    }
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
