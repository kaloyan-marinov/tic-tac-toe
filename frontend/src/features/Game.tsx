import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

export const Game = () => {
  console.log(
    `${new Date().toISOString()} - ${__filename}` +
      ` - React is rendering <MyMonthlyJournal>`
  );

  const entriesIds: number[] = useSelector(selectEntriesIds);
  console.log("    entriesIds:");
  console.log(`    ${JSON.stringify(entriesIds)}`);

  const entriesEntities: { [entryId: string]: IEntry } =
    useSelector(selectEntriesEntities);
  console.log("    entriesEntities:");
  console.log(`    ${JSON.stringify(entriesEntities)}`);

  const dispatch: ThunkDispatch<IState, unknown, IActionClearAuthSlice | ActionAlerts> =
    useDispatch();

  React.useEffect(() => {
    console.log(
      `${new Date().toISOString()}` +
        ` - ${__filename}` +
        ` - React is running <MyMonthlyJournal>'s useEffect hook`
    );

    const effectFn = async () => {
      console.log(
        "    <MyMonthlyJournal>'s useEffect hook is dispatching fetchEntries()"
      );

      try {
        await dispatch(fetchEntries());
      } catch (err) {
        if (err.response.status === 401) {
          dispatch(
            signOut("[FROM <MyMonthlyJournal>'S useEffect HOOK] PLEASE SIGN BACK IN")
          );
        } else {
          const id: string = uuidv4();
          const message: string =
            err.response.data.error ||
            "ERROR NOT FROM BACKEND BUT FROM FRONTEND COMPONENT";
          dispatch(alertsCreate(id, message));
        }
      }
    };

    effectFn();
  }, [dispatch]);

  const entries = entriesIds.map((entryId: number) => {
    const e: IEntry = entriesEntities[entryId];

    return (
      <div key={e.id}>
        <hr />
        <SingleEntry timestampInUTC={e.timestampInUTC} content={e.content} />
        <ul>
          <li>
            <Link to={`/entries/${e.id}/edit`}>Edit</Link>
          </li>
          <li>
            <DeleteEntryLink to={`/entries/${e.id}/delete`} />
          </li>
        </ul>
      </div>
    );
  });

  return (
    <React.Fragment>
      {"<MyMonthlyJournal>"}
      <div>Review the entries in MyMonthlyJournal!</div>
      <Link to="/entries/create">Create a new entry</Link>
      {entries}
    </React.Fragment>
  );
};
};
