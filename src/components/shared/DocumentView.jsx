import { Fragment } from "react";
import { PreviewCard } from "./PreviewCard";

export const DocumentView = ({ model, document }) => {
  return (
    <Fragment>
      <PreviewCard model={model} {...document} />
    </Fragment>
  );
};
