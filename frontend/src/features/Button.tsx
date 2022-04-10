import { useDispatch, useSelector } from "react-redux";
import {
  alertsCreate,
  editGame,
  IGame,
  selectGameState,
  selectGameWinner,
} from "../types";
import { v4 as uuidv4 } from "uuid";
import { EMPTY_CONTENT } from "../constants";

export const Button = ({ x, y }: { x: number; y: number }) => {
  const gameState = useSelector(selectGameState);
  const gameWinner = useSelector(selectGameWinner);

  const dispatch = useDispatch();

  const content = gameState[x][y] === null ? EMPTY_CONTENT : gameState[x][y].username;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const alertId: string = uuidv4();

    try {
      await dispatch(editGame(x, y));
      // await dispatch(
      //   alertsCreate(
      //     alertId,
      //     "You have played your turn; it's your opponent's turn now."
      //   )
      // );
    } catch (err) {
      dispatch(alertsCreate(alertId, err as string));
    }
  };

  return (
    <button
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClick(e)}
      disabled={gameWinner !== null || content !== EMPTY_CONTENT}
    >
      {content}
    </button>
  );
};
