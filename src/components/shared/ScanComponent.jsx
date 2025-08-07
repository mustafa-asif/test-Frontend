import { Dialog } from "@mui/material";
import { Component, Fragment, useState, useEffect } from "react";
import QrScanner from "react-qr-scanner";
import { useToast } from "../../hooks/useToast";
import { usePlaySound } from "../../sounds/Sounds";
import { xFetch } from "../../utils/constants";
import { getIDModelName } from "../../utils/misc";
import { AutocompleteInput, Input } from "./Input";
import { useStoreState } from "easy-peasy";
import { useLocation } from "react-router-dom";

export const ScanComponent = ({ isOpen, setOpen, state, customLoading, autoClose = true }) => {
  const [isParsing, setParsing] = useState(false);
  const playSound = usePlaySound();
  const showToast = useToast();
  const user = useStoreState((state) => state.auth.user);
  const location = useLocation();
  const model = state.model;

  // Keep scanner open for warehouse users on pickups or when doing inventory scan
  const shouldKeepOpen = user?.role === "warehouse" &&
    ((model === "pickups") || (model === "products" && state.fetchDocument));

  console.log('ScanComponent state:', {
    userRole: user?.role,
    model,
    fetchDocument: state.fetchDocument,
    shouldKeepOpen,
    autoClose
  });

  function handleClose() {
    setOpen(false);
    state.onClose?.();
  }

  async function handleData(id) {
    if (isParsing) return;

    const model = getIDModelName(id);
    if (state.allowedModels && !state.allowedModels.includes(model)) {
      setParsing(true);
      showToast(`Not scanning ${model || id}.`, "error");
      return setTimeout(() => {
        setParsing(false);
      }, 2000);
    }

    if (!state.fetchDocument) {
      state.onData?.(id);
      if (!shouldKeepOpen && autoClose) handleClose();
      return;
    }

    setParsing(true);
    const { data, error } = await xFetch(`/${model}/${id}?_show=${getModelProjection(model)}`);
    if (error) {
      showToast(error, "error");
      playSound("scan-error");
    }
    if (data) {
      state.onData?.(data);
      if (!shouldKeepOpen && autoClose) handleClose();
      playSound("scan-success");
    }
    setParsing(false);
  }

  return (
    <Dialog onClose={handleClose} open={isOpen} fullScreen>
      {customLoading ? (
        <div className="animate-pulse text-black m-auto">{customLoading}</div>
      ) : isParsing ? (
        <div className="animate-pulse text-black m-auto">Parsing...</div>
      ) : isOpen ? (
        <CameraComponent onData={handleData} onCancel={handleClose} />
      ) : (
        <></>
      )}
    </Dialog>
  );
};

class CameraComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, hasLoaded: false, inputValue: "" };
    this.handleError = this.handleError.bind(this);
    this.handleLoaded = this.handleLoaded.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { ...this.state, hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  handleError(err) {
    console.log("Camera Error: ", err);
    this.setState({ ...this.state, hasError: true });
  }

  handleLoaded() {
    this.setState({ ...this.state, hasLoaded: true });
  }

  handleData(data) {
    if (!data?.text || !this.state.hasLoaded) return;
    this.props.onData?.(data.text);
  }

  handleInput(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    this.props.onData?.(e.target.value);
  }

  render() {
    return (
      <Fragment>
        <div className="p-3 absolute w-full z-50 flex">
          <span
            className="w-12 h-12 text-2xl text-gray-700 bg-gray-100 inline-flex items-center justify-center rounded-full mr-3 shadow-lg hover:shadow-xl hover:bg-gray-200 transition duration-300 cursor-pointer"
            onClick={() => this.props.onCancel?.()}
            disabled={!this.state.hasLoaded && !this.state.hasError}>
            <i className="fas fa-arrow-left"></i>
          </span>
          <div className="flex items-center relative">
            <span className="bg-gray-500 w-10 h-10 z-50 ml-1 text-xl text-white absolute rounded-full flex items-center justify-center pointer-events-none">
              <i className="fas fa-qrcode"></i>
            </span>
            {/* <AutocompleteInput
              className="pl-14 text-xl font-bold w-40"
              fullWidth={false}
              disabled={!this.state.hasLoaded && !this.state.hasError}
              value={this.state.inputValue}
              onKeyPress={this.handleInput}
              options={["itabc123", "itxyz321", "itxxx666", "itooo999"]}
              onValueChange={(inputValue) => this.setState({ ...this.state, inputValue })}
              inputProps={{
                placeholder: "000",
                type: "tel",
                pattern: "[0-9]*",
              }}
            /> */}
            <Input
              placeholder="ID de l'article"
              className="pl-14 text-xl font-bold"
              disabled={!this.state.hasLoaded && !this.state.hasError}
              value={this.state.inputValue.trim()}
              onValueChange={(inputValue) => this.setState({ ...this.state, inputValue })}
              onKeyPress={this.handleInput}
            />
          </div>
        </div>
        {this.state.hasError ? (
          <div className="flex items-center justify-center h-full">
            <h2>Failed to Load Camera.</h2>
          </div>
        ) : (
          <QrScanner
            onError={this.handleError}
            onScan={this.handleData}
            onLoad={this.handleLoaded}
            delay={450}
            constraints={getConstraints()}
            style={{ width: "100vw", height: "100vh", position: "relative", zIndex: "1" }}
          />
        )}
      </Fragment>
    );
  }
}
function getModelProjection(model) {
  switch (model) {
    case "items":
      return "product";
    default:
      return "_id";
  }
}

function getConstraints() {
  const isDesktop = window.innerWidth > 700;
  if (!isDesktop) {
    return {
      video: {
        facingMode: { exact: `environment` },
      },
    };
  }
}
