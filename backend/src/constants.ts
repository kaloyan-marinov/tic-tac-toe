export const PORT: number = 3000;
export const PORT_FOR_TESTING: number = 3001;

export const connectionName: string =
  process.env.NODE_ENV === "test"
    ? "connection-to-db-for-testing"
    : "connection-to-db-for-dev";
