import { isTenant, tenantEnv, tenantId } from "../tenant-config";

export const MAINTENANCE_MODE = false;
export const MAINTENANCE_START = "";

export const { API_URL, WS_URL, IMG_GET_URL, IMG_POST_URL, AUTH_URL, JOBS_URL, STATS_URL } =
  (() => {
    if (window.location.hostname === "localhost" || (isTenant && tenantEnv === "development")) {
      return {
        API_URL: "http://localhost:4000",
        WS_URL: "http://localhost:2000",
        JOBS_URL: "http://localhost:5000",
        STATS_URL: "http://localhost:7000",
        AUTH_URL: "http://localhost:9000",
        IMG_POST_URL: "http://localhost:8080",
        IMG_GET_URL: "http://localhost:4566/test",
      };
    }

    if (window.location.hostname.includes("staging") || (isTenant && tenantEnv === "staging")) {
      return {
        API_URL: "https://staging-rest.livo.ma",
        WS_URL: "https://staging-ws.livo.ma",
        JOBS_URL: "https://staging-jobs.livo.ma",
        STATS_URL: "https://staging-stats.livo.ma",
        IMG_POST_URL: "https://staging-img.livo.ma",
        AUTH_URL: "https://staging-auth.livo.ma",
        IMG_GET_URL: "https://livobucket.fra1.cdn.digitaloceanspaces.com",
      };
    }

    if (window.location.hostname.includes("testing") || (isTenant && tenantEnv === "testing")) {
      return {
        API_URL: "https://testing-rest.livo.ma",
        WS_URL: "https://testing-ws.livo.ma",
        JOBS_URL: "https://testing-jobs.livo.ma",
        STATS_URL: "https://testing-stats.livo.ma",
        IMG_POST_URL: "https://testing-img.livo.ma",
        AUTH_URL: "https://testing-auth.livo.ma",
        IMG_GET_URL: "https://livobucket.fra1.cdn.digitaloceanspaces.com",
      };
    }
    return {
      API_URL: "https://rest.livo.ma",
      WS_URL: "https://ws.livo.ma",
      JOBS_URL: "https://jobs.livo.ma",
      STATS_URL: "https://stats.livo.ma",
      IMG_POST_URL: "https://img.livo.ma",
      AUTH_URL: "https://auth.livo.ma",
      IMG_GET_URL: "https://livobucket.fra1.cdn.digitaloceanspaces.com",
    };
  })();

// export const LOGO_URL = "/img/logo.svg";
// export const LOGO_ICON_URL = "/img/logo-icon.png";

export const xFetch = async (route, config, skipDefault, baseUrl = undefined, queryParams = []) => {
  config = { method: "GET", credentials: "include", ...config };
  if (config.body && !skipDefault) {
    config.headers = { "Content-Type": "application/json", ...config.headers };
    config.body = JSON.stringify(config.body);
  }

  if (window.location.hostname === "localhost" && isTenant) {
    config.headers ??= {};
    config.headers["tenant_id"] = tenantId;
  }

  if (queryParams.length) {
    route += `?${queryParams.join("&")}`;
  }
  try {
    const resp = await fetch((baseUrl || API_URL) + route, config);
    const { success, data } = await resp.json();
    if (!success) {
      const lang = localStorage.getItem("$LANG");
      const error = (() => {
        if (lang === "en") return data.en_message || data.fr_message;
        return data.fr_message || data.en_message;
      })();
      return {
        error,
        error_field: data.field,
        error_type: data.type,
        error_details: data.details,
      };
    }
    return data;
  } catch (err) {
    console.log(err);
    const lang = localStorage.getItem("$LANG");
    const error = lang === "en" ? "Failed to fetch" : "Echec de la requête";
    const aborted = `${err}`.includes("user aborted");
    return { error, aborted };
  }
};

export const getHumanDate = (date, long) => {
  if (!date) return "";
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = Date.now() - new Date(date).getTime();
  if (isNaN(elapsed)) return "";

  if (elapsed < msPerMinute) {
    const int = Math.round(elapsed / 1000);
    return fmtDateLabel(int, "second", long);
  } else if (elapsed < msPerHour) {
    const int = Math.round(elapsed / msPerMinute);
    return fmtDateLabel(int, "minute", long);
  } else if (elapsed < msPerDay) {
    const int = Math.round(elapsed / msPerHour);
    return fmtDateLabel(int, "hour", long);
  } else if (elapsed < msPerMonth) {
    const int = Math.round(elapsed / msPerDay);
    return fmtDateLabel(int, "day", long);
  } else if (elapsed < msPerYear) {
    const int = Math.round(elapsed / msPerMonth);
    return fmtDateLabel(int, "month", long);
  } else {
    const int = Math.round(elapsed / msPerYear);
    return fmtDateLabel(int, "year", long);
  }
};

function fmtDateLabel(int, word, long) {
  let label = int;
  if (long) {
    if (word === "second") return "a few seconds ago";
    if (int > 1) label += " " + word + "s ago";
    else label += " " + word + " ago";
  } else {
    if (word === "second") return "now";
    if (word === "month") label += "mt";
    else label += word.charAt(0);
  }
  return label;
}

export const fakeWaiting = (ms = 2000) =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });

export const fmtDate = (date) => {
  const d = new Date(date);
  return (
    d.toISOString().split("T")[0] +
    " " +
    d.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    })
  ); // 2021-04-28 15:18:56
};

// export function imgSrc(string, transformations = "") {
//   if (transformations) {
//     transformations = "/" + transformations;
//   }
//   if (typeof string !== "string") return string;
//   return IMG_GET_URL + transformations + "/v1647186950/" + string + ".png";
// }

export function imgSrc(string, transformations = "") {
  if (typeof string !== "string") return string;
  return IMG_GET_URL + "/" + string;
}

export function audioSrc(string) {
  if (typeof string !== "string") return string;

  // return IMG_GET_URL.replace(/image/, "video") + "/v1647186950/" + string + ".ogg";
  // return IMG_GET_URL.replace(/image/, "video") + "/v1647186950/" + string;
  if (typeof string !== "string") return string;
  return IMG_GET_URL + "/" + string;
}

export const MINIMUM_PAYOUT = 30;
