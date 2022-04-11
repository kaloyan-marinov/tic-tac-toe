import { useDispatch, useSelector } from "react-redux";
import { alertsRemove, IAlert, selectAlertsEntities, selectAlertsIds } from "../store";

export const Alerts = () => {
  const alertsIds: string[] = useSelector(selectAlertsIds);

  const alertsEntities: { [alertId: string]: IAlert } =
    useSelector(selectAlertsEntities);

  const dispatch = useDispatch();

  const handleClick = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(alertsRemove(id));
  };

  return (
    <>
      {alertsIds.length === 0 ? (
        <br />
      ) : (
        alertsIds.map((id: string) => (
          <div key={id} style={{ color: "red" }}>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleClick(id, e)}
            >
              Clear alert
            </button>
            {alertsEntities[id].message}
          </div>
        ))
      )}
    </>
  );
};
