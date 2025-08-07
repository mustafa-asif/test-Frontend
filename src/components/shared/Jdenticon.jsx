import { FC, Fragment, HTMLProps } from "react";
import { toSvg } from "jdenticon";

export const Jdenticon = ({ value, width = 100, ...props }) => {
  const svgStr = toSvg(value, width);
  return <div dangerouslySetInnerHTML={{ __html: svgStr }} {...props} />;
};
