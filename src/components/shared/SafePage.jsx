import { Component } from "react";
import ErrorPage from "../../pages/shared/Error";
import { xFetch } from "../../utils/constants";

export const withCatch = (Component) => {
  return function (props) {
    return (
      <SafePage>
        <Component {...props} />
      </SafePage>
    );
  };
};

class SafePage extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    xFetch("/incidents", {
      method: "POST",
      body: { message: error.message, full_error: `${error}`, url: window.location.pathname },
    })
      .then(() => console.log("incident reported"))
      .catch((error) => console.error("Failed to report incident", error));
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}
