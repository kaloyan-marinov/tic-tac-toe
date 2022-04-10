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

export const initialStateGame = {
  requestStatus: RequestStatus.IDLE,
  requestError: null,
  id: -1,
  state: [],
  winner: null,
};

export interface IState {
  alerts: IStateAlerts;
  auth: IStateAuth;
  game: any;
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
        // console.log(err);
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

/* authSlice - reducer */
export const authReducer = (
  stateAuth: IStateAuth = initialStateAuth,
  action: ActionCreateUser
  // | ActionIssueJWSToken
  // | ActionFetchProfile
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

    // case ActionTypesIssueJWSToken.PENDING:
    //   return {
    //     ...stateAuth,
    //     requestStatus: RequestStatus.LOADING,
    //     requestError: null,
    //   };

    // case ActionTypesIssueJWSToken.REJECTED:
    //   return {
    //     ...stateAuth,
    //     requestStatus: RequestStatus.FAILED,
    //     requestError: action.error,
    //     hasValidToken: false,
    //   };

    // case ActionTypesIssueJWSToken.FULFILLED:
    //   return {
    //     ...stateAuth,
    //     requestStatus: RequestStatus.SUCCEEDED,
    //     requestError: null,
    //     token: action.payload.token,
    //     hasValidToken: true,
    //   };

    // case ActionTypesFetchProfile.PENDING:
    //   return {
    //     ...stateAuth,
    //     requestStatus: RequestStatus.LOADING,
    //     requestError: null,
    //   };

    // case ActionTypesFetchProfile.REJECTED:
    //   return {
    //     ...stateAuth,
    //     requestStatus: RequestStatus.FAILED,
    //     requestError: action.error,
    //     hasValidToken: false,
    //   };

    // case ActionTypesFetchProfile.FULFILLED: {
    //   const profile: IProfile = action.payload.profile;

    //   return {
    //     ...stateAuth,
    //     requestStatus: RequestStatus.SUCCEEDED,
    //     requestError: null,
    //     hasValidToken: true,
    //     signedInUserProfile: profile,
    //   };
    // }

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

/*
Define a root reducer function,
which serves to instantiate a single Redux store.
(In turn, that store will be responsible for keeping track of the React application's
global state.)
*/
export const rootReducer = combineReducers({
  alerts: alertsReducer,
  auth: authReducer,
  // entries: gameReducer,
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
