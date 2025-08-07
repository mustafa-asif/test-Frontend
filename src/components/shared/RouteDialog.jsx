import { Fragment, useMemo } from "react";
import { useLocation } from "react-router-dom";

export const RouteDialog = ({ component: Component, path, validParams = undefined, ...props }) => {
  const location = useLocation();

  const extraProps = useMemo(() => {
    let open = false;
    let pathParams = {};

    if (typeof path === "string") {
      let pathRule = path.replace(/\/$/, "");
      let currentPath = location.pathname.split("?")[0].replace(/\/$/, "");

      const regex = new RegExp(`^${pathRule.replace(/\/\:[^\/]*/g, "/[^/]*")}$`);
      open = regex.test(currentPath);
      pathParams = findParams(pathRule, currentPath);
    }

    if (typeof path === "object" && Array.isArray(path)) {
      for (const option of path) {
        let pathRule = option.replace(/\/$/, "");
        let currentPath = location.pathname.split("?")[0].replace(/\/$/, "");
        const regex = new RegExp(`^${pathRule.replace(/\/\:[^\/]*/g, "/[^/]*")}$`);

        if (regex.test(currentPath)) {
          open = true;
          pathParams = findParams(pathRule, currentPath);
        }
      }
    }

    return { open, ...pathParams };
  }, [location.pathname, path]);

  for (const param in validParams) {
    if (validParams[param].includes(extraProps[param])) continue;
    return <Fragment></Fragment>;
  }

  return <Component {...extraProps} {...props} />;
};

function findParams(rule, currentPath) {
  const params = {};
  const ruleParts = rule.split("/");
  const pathParts = currentPath.split("/");

  for (let i = 0; i < ruleParts.length; i++) {
    let part = ruleParts[i];
    if (!part.startsWith(":")) continue;
    params[part.slice(1)] = pathParts[i];
  }

  return params;
}
