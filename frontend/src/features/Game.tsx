import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { v4 as uuidv4 } from "uuid";
import { ERROR_NOT_FROM_BACKEND } from "../constants";
import {
  ActionAlerts,
  alertsCreate,
  fetchGame,
  IGame,
  IState,
  selectGame,
} from "../types";

export const Game = () => {
  console.log(
    `${new Date().toISOString()} - ${__filename}` + ` - React is rendering <Game>`
  );

  const game: IGame = useSelector(selectGame);
  console.log("    game:");
  console.log(`    ${JSON.stringify(game)}`);

  // const dispatch: ThunkDispatch<IState, unknown, IActionClearAuthSlice | ActionAlerts> =
  const dispatch: ThunkDispatch<IState, unknown, ActionAlerts> = useDispatch();

  React.useEffect(() => {
    console.log(
      `${new Date().toISOString()}` +
        ` - ${__filename}` +
        ` - React is running <Game>'s useEffect hook`
    );

    const effectFn = async () => {
      console.log("    <Game>'s useEffect hook is dispatching fetchEntries()");

      try {
        await dispatch(fetchGame());
      } catch (err) {
        const id: string = uuidv4();

        let message: string;
        if (axios.isAxiosError(err) && err.response) {
          message = err.response.data.error || ERROR_NOT_FROM_BACKEND;
        } else {
          message = ERROR_NOT_FROM_BACKEND;
        }

        dispatch(alertsCreate(id, message));
      }
    };

    effectFn();
  }, [dispatch]);

  return <React.Fragment>{JSON.stringify(game)}</React.Fragment>;
};
