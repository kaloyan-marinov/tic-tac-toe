# Introduction

This repository implements a simple web-based Tic-Tac-Toe game.

This project is broken up into two sub-projects:

- the `backend` sub-project has its own `README.md`

- the `frontend` sub-project has its own `README.md`

# Existing limitations

- Few tests have been written for the `backend`.

- Authentication is implemented in a very simplified way.

    - A user registers by providing a username but no password.

    - Subsequent requests to protected endpoints are authenticated via an HTTP header with the following structure: `Authorization: Bearer <username>`.

- The `backend` allows only 2 user accounts to be created.

- Although the `backend` allows multiple games to be created, issuing `PUT` and `GET` requests to `/api/games` always manipulates the game that was created last. (In a loose sense, that means that only 1 game can be played.)

- There is no functionality in the `backend` for deleting a game. Deleting a game can be achieved as follows:
    ```
    backend $ sqlite3 <value-of-the-DATABASE_URL-environment-variable>

    sqlite> DELETE * FROM games;
    ```

---

- No tests have been written for the `frontend`.

- No CSS styling has been added to the `frontend`.

- The `<NavBar>` doesn't get properly updated after a successful log-in.

- There is no functionality for logging out.