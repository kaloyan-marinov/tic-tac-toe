import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { v4 as uuidv4 } from "uuid";
import { ERROR_NOT_FROM_BACKEND, MILLISECONDS_EQUAL_TO_1_MIN } from "../constants";
import {
  ActionAlerts,
  alertsCreate,
  createGame,
  fetchGame,
  IState,
  selectGameId,
  selectGameWinner,
} from "../store";
import { Button } from "./Button";

export const Game = () => {
  const gameId = useSelector(selectGameId);
  const gameWinner = useSelector(selectGameWinner);

  // const dispatch: ThunkDispatch<IState, unknown, IActionClearAuthSlice | ActionAlerts> =
  const dispatch: ThunkDispatch<IState, unknown, ActionAlerts> = useDispatch();

  React.useEffect(() => {
    const effectFn = async () => {
      console.log(
        `${new Date().toISOString()}` +
          ` - ${__filename}` +
          ` - React is running <Game>'s useEffect hook`
      );

      if (gameWinner === null) {
        console.log("    <Game>'s useEffect hook is dispatching fetchGame()");

        try {
          await dispatch(fetchGame());
        } catch (err) {
          const id: string = uuidv4();

          let message: string;
          if (axios.isAxiosError(err) && err.response) {
            message = err.response.data.error || ERROR_NOT_FROM_BACKEND;
          } else {
            message = err as string;
          }

          if (message !== "You aren't currently playing a game") {
            dispatch(alertsCreate(id, message));
          }
        }
      }
    };

    const interval: NodeJS.Timer = setInterval(() => {
      effectFn();
    }, MILLISECONDS_EQUAL_TO_1_MIN);

    return () => {
      clearInterval(interval);
    };
  }, [dispatch]);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const alertId: string = uuidv4();

    try {
      await dispatch(createGame());
      await dispatch(alertsCreate(alertId, "You have started a new game"));
    } catch (err) {
      dispatch(alertsCreate(alertId, err as string));
    }
  };

  if (gameId === -1) {
    return (
      <React.Fragment>
        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClick(e)}>
          Start a new game
        </button>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <table>
        <tbody>
          <tr>
            <td>
              <Button x={0} y={0} />
            </td>
            <td>
              <Button x={0} y={1} />
            </td>
            <td>
              <Button x={0} y={2} />
            </td>
          </tr>
          <tr>
            <td>
              <Button x={1} y={0} />
            </td>
            <td>
              <Button x={1} y={1} />
            </td>
            <td>
              <Button x={1} y={2} />
            </td>
          </tr>
          <tr>
            <td>
              <Button x={2} y={0} />
            </td>
            <td>
              <Button x={2} y={1} />
            </td>
            <td>
              <Button x={2} y={2} />
            </td>
          </tr>
        </tbody>
      </table>
      {gameWinner !== null && (
        <div>
          <p>{`${gameWinner} has won this game!`}</p>
          <button>Leave this game</button>
        </div>
      )}
    </React.Fragment>
  );
};
