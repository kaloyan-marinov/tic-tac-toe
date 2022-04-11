import { applyMiddleware, combineReducers, createStore } from "redux";
import axios from "axios";
import { Dispatch } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { ERROR_NOT_FROM_BACKEND } from "./constants";

export enum RequestStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

export interface IAlert {
  id: string;
  message: string;
}

export const initialStateAlerts: IStateAlerts = {
  ids: [],
  entities: {},
};

export interface IStateAlerts {
  ids: string[];
  entities: {
    [alertId: string]: IAlert;
  };
}

export interface IProfile {
  id: number;
  username: string;
}

interface IStateAuth {
  requestStatus: RequestStatus;
  requestError: string | null;
  token: string | null;
  hasValidToken: boolean | null;
  signedInUserProfile: IProfile | null;
}

export const NAME_OF_ACCESS_TOKEN = "token-4-tic-tac-toe-app";

export const initialStateAuth: IStateAuth = {
  requestStatus: RequestStatus.IDLE,
  requestError: null,
  token: localStorage.getItem(NAME_OF_ACCESS_TOKEN),
  hasValidToken: null,
  signedInUserProfile: null,
};

export interface IGame {
  id: number;
  state: any;
  winner: string | null;
}

export interface IStateGame {
  requestStatus: RequestStatus;
  requestError: string | null;
  id: number;
  state: any;
  winner: string | null;
}

export const initialStateGame: IStateGame = {
  requestStatus: RequestStatus.IDLE,
  requestError: null,
  id: -1,
  state: [],
  winner: null,
};

export interface IState {
  alerts: IStateAlerts;
  auth: IStateAuth;
  game: IStateGame;
}

/* alertsSlice - "alerts/" action creators */
enum ActionTypesAlerts {
  CREATE = "alerts/create",
  REMOVE = "alerts/remove",
}

interface IActionAlertsCreate {
  type: typeof ActionTypesAlerts.CREATE;
  payload: {
    id: string;
    message: string;
  };
}

interface IActionAlertsRemove {
  type: typeof ActionTypesAlerts.REMOVE;
  payload: {
    id: string;
  };
}

export const alertsCreate = (id: string, message: string): IActionAlertsCreate => ({
  type: ActionTypesAlerts.CREATE,
  payload: {
    id,
    message,
  },
});

export const alertsRemove = (id: string): IActionAlertsRemove => ({
  type: ActionTypesAlerts.REMOVE,
  payload: {
    id,
  },
});

export type ActionAlerts = IActionAlertsCreate | IActionAlertsRemove;

/* alertsSlice - reducer */
export const alertsReducer = (
  stateAlerts: IStateAlerts = initialStateAlerts,
  action: ActionAlerts
): IStateAlerts => {
  switch (action.type) {
    case ActionTypesAlerts.CREATE:
      const id: string = action.payload.id;
      const message: string = action.payload.message;

      const newIds: string[] = [id, ...stateAlerts.ids];

      const newEntities: { [alertId: string]: IAlert } = { ...stateAlerts.entities };
      newEntities[id] = {
        id,
        message,
      };

      return {
        ids: newIds,
        entities: newEntities,
      };

    case ActionTypesAlerts.REMOVE:
      const idOfDeletedAlert: string = action.payload.id;

      const remainingIds: string[] = stateAlerts.ids.filter(
        (id) => id !== idOfDeletedAlert
      );

      const remainingEntities = { ...stateAlerts.entities };
      delete remainingEntities[idOfDeletedAlert];

      return {
        ids: remainingIds,
        entities: remainingEntities,
      };

    default:
      return stateAlerts;
  }
};

/* authSlice - "auth/createUser/" action creators */
enum ActionTypesCreateUser {
  PENDING = "auth/createUser/pending",
  REJECTED = "auth/createUser/rejected",
  FULFILLED = "auth/createUser/fulfilled",
}

interface IActionCreateUserPending {
  type: typeof ActionTypesCreateUser.PENDING;
}

interface IActionCreateUserRejected {
  type: typeof ActionTypesCreateUser.REJECTED;
  error: string;
}

interface IActionCreateUserFulfilled {
  type: typeof ActionTypesCreateUser.FULFILLED;
}

export const createUserPending = (): IActionCreateUserPending => ({
  type: ActionTypesCreateUser.PENDING,
});

export const createUserRejected = (error: string): IActionCreateUserRejected => ({
  type: ActionTypesCreateUser.REJECTED,
  error,
});

export const createUserFulfilled = (): IActionCreateUserFulfilled => ({
  type: ActionTypesCreateUser.FULFILLED,
});

export type ActionCreateUser =
  | IActionCreateUserPending
  | IActionCreateUserRejected
  | IActionCreateUserFulfilled;

/* authSlice - "auth/createUser" thunk-action creator */
export const createUser = (
  username: string
): ThunkAction<Promise<any>, IState, unknown, ActionCreateUser> => {
  /*
  Create a thunk-action.
  When dispatched, it issues an HTTP request
  to the backend's endpoint for creating a new User resource.
  */

  return async (dispatch: Dispatch<ActionCreateUser>) => {
    /*
    TODO: find out whether the type annotation of `dispatch` in the function signature
          above (and in analogous cases) is OK, or if it had better be removed
          completely
    */
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      username,
    });

    dispatch(createUserPending());
    try {
      const response = await axios.post("/api/users", body, config);
      dispatch(createUserFulfilled());
      return Promise.resolve();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const responseBody = err.response.data;
        const responseBodyError =
          responseBody.error || responseBody.msg || ERROR_NOT_FROM_BACKEND;
        dispatch(createUserRejected(responseBodyError));
        return Promise.reject(responseBodyError);
      }

      return Promise.reject(ERROR_NOT_FROM_BACKEND);
    }
  };
};

/* authSlice - "auth/issueJWSToken/" action creators */
export enum ActionTypesIssueJWSToken {
  PENDING = "auth/issueJWSToken/pending",
  REJECTED = "auth/issueJWSToken/rejected",
  FULFILLED = "auth/issueJWSToken/fulfilled",
}

interface IActionIssueJWSTokenPending {
  type: typeof ActionTypesIssueJWSToken.PENDING;
}

interface IActionIssueJWSTokenRejected {
  type: typeof ActionTypesIssueJWSToken.REJECTED;
  error: string;
}

interface IActionIssueJWSTokenFulfilled {
  type: typeof ActionTypesIssueJWSToken.FULFILLED;
  payload: {
    token: string;
  };
}

export const issueJWSTokenPending = (): IActionIssueJWSTokenPending => ({
  type: ActionTypesIssueJWSToken.PENDING,
});

export const issueJWSTokenRejected = (error: string): IActionIssueJWSTokenRejected => ({
  type: ActionTypesIssueJWSToken.REJECTED,
  error,
});

export const issueJWSTokenFulfilled = (
  token: string
): IActionIssueJWSTokenFulfilled => ({
  type: ActionTypesIssueJWSToken.FULFILLED,
  payload: {
    token,
  },
});

type ActionIssueJWSToken =
  | IActionIssueJWSTokenPending
  | IActionIssueJWSTokenRejected
  | IActionIssueJWSTokenFulfilled;

/* authSlice - "auth/issueJWSToken" thunk-action creator */
export const issueJWSToken = (
  username: string
): ThunkAction<Promise<any>, IState, unknown, ActionIssueJWSToken> => {
  /*
  Create a thunk-action.
  When dispatched, it issues an HTTP request
  to the backend's endpoint for issuing a JSON Web Signature token
  (via which the client can subsequently authenticate itself to the backend
  application).
  */

  return async (dispatch: Dispatch<ActionIssueJWSToken>) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + username,
      },
    };

    const body = {};

    dispatch(issueJWSTokenPending());
    try {
      const response = await axios.post("/api/tokens", body, config);
      localStorage.setItem(NAME_OF_ACCESS_TOKEN, response.data.token);
      dispatch(issueJWSTokenFulfilled(response.data.token));
      return Promise.resolve();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const responseBody = err.response.data;
        const responseBodyError =
          responseBody.error || responseBody.msg || ERROR_NOT_FROM_BACKEND;
        dispatch(issueJWSTokenRejected(responseBodyError));
        return Promise.reject(responseBodyError);
      }

      return Promise.reject(ERROR_NOT_FROM_BACKEND);
    }
  };
};

/* authSlice - "auth/fetchProfile/" action creators */
enum ActionTypesFetchProfile {
  PENDING = "auth/fetchProfile/pending",
  REJECTED = "auth/fetchProfile/rejected",
  FULFILLED = "auth/fetchProfile/fulfilled",
}

interface IActionFetchProfilePending {
  type: typeof ActionTypesFetchProfile.PENDING;
}

interface IActionFetchProfileRejected {
  type: typeof ActionTypesFetchProfile.REJECTED;
  error: string;
}

interface IActionFetchProfileFulfilled {
  type: typeof ActionTypesFetchProfile.FULFILLED;
  payload: {
    profile: IProfile;
  };
}

export const fetchProfilePending = (): IActionFetchProfilePending => ({
  type: ActionTypesFetchProfile.PENDING,
});

export const fetchProfileRejected = (error: string): IActionFetchProfileRejected => ({
  type: ActionTypesFetchProfile.REJECTED,
  error,
});

export const fetchProfileFulfilled = (
  profile: IProfile
): IActionFetchProfileFulfilled => ({
  type: ActionTypesFetchProfile.FULFILLED,
  payload: {
    profile,
  },
});

export type ActionFetchProfile =
  | IActionFetchProfilePending
  | IActionFetchProfileRejected
  | IActionFetchProfileFulfilled;

/* authSlice - "auth/fetchProfile" thunk-action creator */
export const fetchProfile = (): ThunkAction<
  Promise<any>,
  IState,
  unknown,
  ActionFetchProfile
> => {
  /*
  Create a thunk-action.
  When dispatched, it makes the web browser issue an HTTP request
  to the backend's endpoint for fetching the Profile of a specific User.
  That User is uniquely specified by JSON Web Signature token,
  which is required to have been saved earlier (by the frontend)
  in the HTTP-request-issuing web browser.
  */

  return async (dispatch) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem(NAME_OF_ACCESS_TOKEN),
      },
    };

    dispatch(fetchProfilePending());
    try {
      const response = await axios.get("/api/user-profile", config);
      dispatch(fetchProfileFulfilled(response.data));
      return Promise.resolve();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const responseBody = err.response.data;
        const responseBodyError =
          responseBody.error || responseBody.msg || ERROR_NOT_FROM_BACKEND;
        dispatch(fetchProfileRejected(responseBodyError));
        return Promise.reject(responseBodyError);
      }

      return Promise.reject(ERROR_NOT_FROM_BACKEND);
    }
  };
};

/* authSlice - reducer */
export const authReducer = (
  stateAuth: IStateAuth = initialStateAuth,
  action: ActionCreateUser | ActionIssueJWSToken | ActionFetchProfile
  // | IActionClearAuthSlice
): IStateAuth => {
  switch (action.type) {
    case ActionTypesCreateUser.PENDING:
      return {
        ...stateAuth,
        requestStatus: RequestStatus.LOADING,
        requestError: null,
      };

    case ActionTypesCreateUser.REJECTED:
      return {
        ...stateAuth,
        requestStatus: RequestStatus.FAILED,
        requestError: action.error,
      };

    case ActionTypesCreateUser.FULFILLED:
      return {
        ...stateAuth,
        requestStatus: RequestStatus.SUCCEEDED,
        requestError: null,
      };

    case ActionTypesIssueJWSToken.PENDING:
      return {
        ...stateAuth,
        requestStatus: RequestStatus.LOADING,
        requestError: null,
      };

    case ActionTypesIssueJWSToken.REJECTED:
      return {
        ...stateAuth,
        requestStatus: RequestStatus.FAILED,
        requestError: action.error,
        hasValidToken: false,
      };

    case ActionTypesIssueJWSToken.FULFILLED:
      return {
        ...stateAuth,
        requestStatus: RequestStatus.SUCCEEDED,
        requestError: null,
        token: action.payload.token,
        hasValidToken: true,
      };

    case ActionTypesFetchProfile.PENDING:
      return {
        ...stateAuth,
        requestStatus: RequestStatus.LOADING,
        requestError: null,
      };

    case ActionTypesFetchProfile.REJECTED:
      return {
        ...stateAuth,
        requestStatus: RequestStatus.FAILED,
        requestError: action.error,
        hasValidToken: false,
      };

    case ActionTypesFetchProfile.FULFILLED: {
      const profile: IProfile = action.payload.profile;

      return {
        ...stateAuth,
        requestStatus: RequestStatus.SUCCEEDED,
        requestError: null,
        hasValidToken: true,
        signedInUserProfile: profile,
      };
    }

    // case ACTION_TYPE_CLEAR_AUTH_SLICE:
    //   return {
    //     ...stateAuth,
    //     token: null,
    //     hasValidToken: false,
    //     signedInUserProfile: null,
    //   };

    default:
      return stateAuth;
  }
};

/* gameSlice - "game/fetchGame" action creators */
enum ActionTypesFetchGame {
  PENDING = "game/fetchGame/pending",
  REJECTED = "game/fetchGame/rejected",
  FULFILLED = "game/fetchGame/fulfilled",
}

interface IActionFetchGamePending {
  type: typeof ActionTypesFetchGame.PENDING;
}

interface IActionFetchGameRejected {
  type: typeof ActionTypesFetchGame.REJECTED;
  error: string;
}

interface IActionFetchGameFulfilled {
  type: typeof ActionTypesFetchGame.FULFILLED;
  payload: {
    game: IGame;
  };
}

export const fetchGamePending = (): IActionFetchGamePending => ({
  type: ActionTypesFetchGame.PENDING,
});

export const fetchGameRejected = (error: string): IActionFetchGameRejected => ({
  type: ActionTypesFetchGame.REJECTED,
  error,
});

export const fetchGameFulfilled = (game: IGame): IActionFetchGameFulfilled => ({
  type: ActionTypesFetchGame.FULFILLED,
  payload: {
    game,
  },
});

export type ActionFetchGame =
  | IActionFetchGamePending
  | IActionFetchGameRejected
  | IActionFetchGameFulfilled;

/* gameSlice - "game/fetchGame" thunk-action creator */
export const fetchGame = (): ThunkAction<
  Promise<any>,
  IState,
  unknown,
  ActionFetchGame
> => {
  return async (dispatch) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem(NAME_OF_ACCESS_TOKEN),
      },
    };

    dispatch(fetchGamePending());
    try {
      const response = await axios.get("/api/games", config);
      dispatch(fetchGameFulfilled(response.data));
      return Promise.resolve();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const responseBody = err.response.data;
        const responseBodyError =
          responseBody.error || responseBody.msg || ERROR_NOT_FROM_BACKEND;
        dispatch(fetchGameRejected(responseBodyError));
        return Promise.reject(responseBodyError);
      }

      return Promise.reject(ERROR_NOT_FROM_BACKEND);
    }
  };
};

/* gameSlice - "game/createGame" action creators */
enum ActionTypesCreateGame {
  PENDING = "game/createGame/pending",
  REJECTED = "game/createGame/rejected",
  FULFILLED = "game/createGame/fulfilled",
}

interface IActionCreateGamePending {
  type: typeof ActionTypesCreateGame.PENDING;
}

interface IActionCreateGameRejected {
  type: typeof ActionTypesCreateGame.REJECTED;
  error: string;
}

interface IActionCreateGameFulfilled {
  type: typeof ActionTypesCreateGame.FULFILLED;
  payload: {
    game: IGame;
  };
}

export const createGamePending = (): IActionCreateGamePending => ({
  type: ActionTypesCreateGame.PENDING,
});

export const createGameRejected = (error: string): IActionCreateGameRejected => ({
  type: ActionTypesCreateGame.REJECTED,
  error,
});

export const createGameFulfilled = (game: IGame): IActionCreateGameFulfilled => ({
  type: ActionTypesCreateGame.FULFILLED,
  payload: {
    game,
  },
});

export type ActionCreateGame =
  | IActionCreateGamePending
  | IActionCreateGameRejected
  | IActionCreateGameFulfilled;

/* gameSlice - "game/createGame" thunk-action creator */
export const createGame = (): ThunkAction<
  Promise<any>,
  IState,
  unknown,
  ActionCreateGame
> => {
  return async (dispatch) => {
    const body = JSON.stringify({});
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem(NAME_OF_ACCESS_TOKEN),
      },
    };

    dispatch(createGamePending());
    try {
      const response = await axios.post("/api/games", body, config);
      dispatch(createGameFulfilled(response.data));
      return Promise.resolve();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const responseBody = err.response.data;
        const responseBodyError =
          responseBody.error || responseBody.msg || ERROR_NOT_FROM_BACKEND;
        dispatch(createGameRejected(responseBodyError));
        return Promise.reject(responseBodyError);
      }

      return Promise.reject(ERROR_NOT_FROM_BACKEND);
    }
  };
};

/* gameSlice - "game/editGame" action creators */
enum ActionTypesEditGame {
  PENDING = "game/editGame/pending",
  REJECTED = "game/editGame/rejected",
  FULFILLED = "game/editGame/fulfilled",
}

interface IActionEditGamePending {
  type: typeof ActionTypesEditGame.PENDING;
}

interface IActionEditGameRejected {
  type: typeof ActionTypesEditGame.REJECTED;
  error: string;
}

interface IActionEditGameFulfilled {
  type: typeof ActionTypesEditGame.FULFILLED;
  payload: {
    game: IGame;
  };
}

export const editGamePending = (): IActionEditGamePending => ({
  type: ActionTypesEditGame.PENDING,
});

export const editGameRejected = (error: string): IActionEditGameRejected => ({
  type: ActionTypesEditGame.REJECTED,
  error,
});

export const editGameFulfilled = (game: IGame): IActionEditGameFulfilled => ({
  type: ActionTypesEditGame.FULFILLED,
  payload: {
    game,
  },
});

export type ActionEditGame =
  | IActionEditGamePending
  | IActionEditGameRejected
  | IActionEditGameFulfilled;

/* gameSlice - "game/editGame" thunk-action creator */
export const editGame = (
  x: number,
  y: number
): ThunkAction<Promise<any>, IState, unknown, ActionEditGame> => {
  return async (dispatch) => {
    const body = JSON.stringify({
      x,
      y,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem(NAME_OF_ACCESS_TOKEN),
      },
    };

    dispatch(editGamePending());
    try {
      const response = await axios.put("/api/games", body, config);
      dispatch(editGameFulfilled(response.data));
      return Promise.resolve();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const responseBody = err.response.data;
        const responseBodyError =
          responseBody.error || responseBody.msg || ERROR_NOT_FROM_BACKEND;
        dispatch(editGameRejected(responseBodyError));
        return Promise.reject(responseBodyError);
      }

      return Promise.reject(ERROR_NOT_FROM_BACKEND);
    }
  };
};

/* authSlice - reducer */
export const gameReducer = (
  stateGame: IStateGame = initialStateGame,
  action: ActionFetchGame | ActionCreateGame | ActionEditGame
  // | IActionClearAuthSlice
): IStateGame => {
  switch (action.type) {
    case ActionTypesFetchGame.PENDING:
      return {
        ...stateGame,
        requestStatus: RequestStatus.LOADING,
        requestError: null,
      };

    case ActionTypesFetchGame.REJECTED:
      return {
        ...stateGame,
        requestStatus: RequestStatus.FAILED,
        requestError: action.error,
      };

    case ActionTypesFetchGame.FULFILLED: {
      const game: IGame = action.payload.game;

      return {
        ...stateGame,
        requestStatus: RequestStatus.SUCCEEDED,
        requestError: null,
        id: game.id,
        state: game.state,
        winner: game.winner,
      };
    }

    case ActionTypesCreateGame.PENDING:
      return {
        ...stateGame,
        requestStatus: RequestStatus.LOADING,
        requestError: null,
      };

    case ActionTypesCreateGame.REJECTED:
      return {
        ...stateGame,
        requestStatus: RequestStatus.FAILED,
        requestError: action.error,
      };

    case ActionTypesCreateGame.FULFILLED: {
      const game: IGame = action.payload.game;

      return {
        ...stateGame,
        requestStatus: RequestStatus.SUCCEEDED,
        requestError: null,
        id: game.id,
        state: game.state,
        winner: null,
      };
    }

    case ActionTypesEditGame.PENDING:
      return {
        ...stateGame,
        requestStatus: RequestStatus.LOADING,
        requestError: null,
      };

    case ActionTypesEditGame.REJECTED:
      return {
        ...stateGame,
        requestStatus: RequestStatus.FAILED,
        requestError: action.error,
      };

    case ActionTypesEditGame.FULFILLED: {
      const game: IGame = action.payload.game;

      return {
        ...stateGame,
        requestStatus: RequestStatus.SUCCEEDED,
        requestError: null,
        id: game.id,
        state: game.state,
        winner: game.winner,
      };
    }

    default:
      return stateGame;
  }
};

/*
Define a root reducer function,
which serves to instantiate a single Redux store.
(In turn, that store will be responsible for keeping track of the React application's
global state.)
*/
export const rootReducer = combineReducers({
  alerts: alertsReducer,
  auth: authReducer,
  game: gameReducer,
});

const composedEnhancer = composeWithDevTools(
  /* Add all middleware functions, which you actually want to use, here: */
  applyMiddleware(thunkMiddleware)
  /* Add other store enhancers if any */
);
export const store = createStore(rootReducer, composedEnhancer);

/* Define selector functions. */
export const selectAlertsIds = (state: IState) => state.alerts.ids;
export const selectAlertsEntities = (state: IState) => state.alerts.entities;

export const selectAuthRequestStatus = (state: IState) => state.auth.requestStatus;
export const selectHasValidToken = (state: IState) => state.auth.hasValidToken;
export const selectSignedInUserProfile = (state: IState) =>
  state.auth.signedInUserProfile;

export const selectGame = (state: IState) => state.game;
