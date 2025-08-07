import { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { getIDModelName } from "../../utils/misc";
import { AltButton } from "./Button";

export const NoSearchResults = ({ model, status, keyword, setFilter, ...props }) => {
  const history = useHistory();
  const keywordModel = getIDModelName(keyword) || model;
  if (keywordModel !== model) {
    return (
      <Fragment>
        <p>Looks like you're searching for a {keywordModel.slice(0, -1).toUpperCase()}</p>
        <AltButton
          label={`Search '${keyword}' in ${keywordModel}`}
          onClick={() => {
            history.push(`/${keywordModel}`, { filter: { status, keyword } });
          }}
        />
      </Fragment>
    );
  }

  if (status !== "all" && keyword) {
    return (
      <AltButton
        label={`Search '${keyword}' in all statuses`}
        onClick={() => setFilter((filter) => ({ ...filter, status: "all" }))}
      />
    );
  }

  return <></>;
};
