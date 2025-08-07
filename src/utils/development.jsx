import { Fragment, useState } from "react";
import { xLogin } from "./auth";
// import Dialog from "@mui/material/Dialog";

// const credentials = [
//   { name: "Warehouse One", phone: "0303030303", password: "warehouseone" },
//   { name: "Warehouse Two", phone: "0404040404", password: "warehousetwo" },
//   { name: "Client One", phone: "0101010101", password: "clientone" },
//   { name: "Client Two", phone: "0202020202", password: "clienttwo" },
//   { name: "Deliverer One", phone: "0707070707", password: "delivererone" },
//   { name: "Deliverer Two", phone: "0808080808", password: "deliverertwo" },
//   { name: "Deliverer Three", phone: "0909090909", password: "delivererthree" },
//   { name: "Deliverer Four", phone: "001001001", password: "delivererfour" },
//   { name: "Followup", phone: "0606060606", password: "followup" },
//   { name: "Payman", phone: "0505050505", password: "payman" },
//   { name: "Admin", phone: "0000000000", password: "lgjuiqzjlgjwznhvjswd94168615245238463885" },
//   { name: "Commercial", password: "commercial", phone: "0020020020" },
// ];

const save_key = "__stored_credentials";

function getSavedCreds() {
  const saved = localStorage.getItem(save_key);
  if (!saved) return [];
  try {
    const creds = JSON.parse(saved);
    if (Array.isArray(creds)) return creds;
    return [];
  } catch (err) {
    console.error(`Failed to parse saved creds: '${saved}' `);
    return [];
  }
}

function saveCreds(creds) {
  localStorage.setItem(save_key, JSON.stringify(creds));
}

export const QuickLogin = () => {
  const [credentials, setCredentials] = useState(getSavedCreds());
  const [isLoading, setLoading] = useState(false);

  async function login(cred) {
    cred.password ||= window.prompt("Password: ");
    if (!cred.password) return window.alert("Password required.");
    setLoading(true);
    const { error } = await xLogin({ ...cred, name: undefined });
    setLoading(false);
    if (error) {
      alert(error);
      return;
    }
    window.location.reload();
  }

  function addCredentials() {
    const name = window.prompt("Name:");
    if (!name) return;
    const phone = window.prompt("Phone:");
    if (!phone) return;
    const password = window.prompt(
      "Password (warning: do not store production passwords in localstorage. Leave empty to be prompted for the password each time):"
    );

    const newCreds = [...credentials, { name, phone, password }];
    setCredentials(newCreds);
    saveCreds(newCreds);
  }

  return (
    <Fragment>
      <div className="rounded overflow-hidden w-max mx-auto absolute top-3 left-3 right-3 shadow-sm cursor-pointer flex flex-wrap">
        {credentials.map((cred) => (
          <button
            key={cred.name}
            className={`bg-white flex-1 hover:bg-gray-50 p-2 active:bg-gray-100 ${
              isLoading ? "opacity-60" : ""
            }`}
            onClick={() => login(cred)}
            disabled={isLoading}>
            {cred.name}
          </button>
        ))}
        <button
          className={`bg-green-100  hover:bg-green-200 p-2 active:bg-green-300 ${
            isLoading ? "opacity-60" : ""
          }`}
          onClick={addCredentials}
          disabled={isLoading}>
          + New Login
        </button>
      </div>
    </Fragment>
  );
};
