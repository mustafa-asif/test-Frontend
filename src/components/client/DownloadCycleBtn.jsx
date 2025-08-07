import { useState } from "react";
import { API_URL, xFetch } from "../../utils/constants";
import { IconButton } from "../shared/Button";
import printJS from "print-js";

export const DownloadCycleBtn = ({ cycle_id, className }) => {
  const [isLoading, setLoading] = useState(false);

  async function getHtml() {
    if (isLoading) return;
    setLoading(true);
    const response = await fetch(API_URL + `/cycles/${cycle_id}/summary.html`, {
      credentials: "include",
    });
    const html = await response.text();
    setLoading(false);
    return printJS({ type: "raw-html", printable: html });
  }

  return (
    <a
      className={className}
      href={[API_URL, "cycles", cycle_id, "summary.html"].join("/")}
      target="_blank"
      download={`paiement-${cycle_id}.html`}>
      <IconButton iconColor={"green"} icon="file-invoice" />
    </a>
  );
  // return (
  //   <IconButton
  //     onClick={getHtml}
  //     isLoading={isLoading}
  //     className={className}
  //     iconColor={"green"}
  //     icon="download"
  //   />
  // );
};
