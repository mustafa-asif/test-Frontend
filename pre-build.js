import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let { TENANT_ID, TENANT_API_URL, TENANT_ENV } = process.env;

const meta = {
  version: Date.now().toString()
};
const metaPath = path.join(process.cwd(), "public", "meta.json");
await fs.writeFile(metaPath, JSON.stringify(meta), "utf-8");
console.log("meta.json created with version:", meta.version);

await fs.writeFile(path.join(process.cwd(), ".env"), `VITE_APP_BUILD_VERSION=${meta.version}\n`, { flag: "a" });
console.log("VITE_APP_BUILD_VERSION added to .env", meta.version);

async function customize() {
  if (!TENANT_API_URL) {
    TENANT_API_URL = "https://rest.livo.ma";
    console.log(`TENANT_API_URL not specified. Defaulting to '${TENANT_API_URL}'`);
  }

  if (!TENANT_ENV) {
    if (TENANT_API_URL.includes("localhost")) TENANT_ENV = "development";
    else if (TENANT_API_URL.includes("staging")) TENANT_ENV = "staging";
    else TENANT_ENV = "production";
    console.log(`TENANT_ENV not specified. Defaulting to '${TENANT_ENV}' based off TENANT_API`);
  }

  let tenant_data;
  if (!TENANT_ID) {
    console.log(`No specific tenant ID, using default data`);
    tenant_data = {
      tenantId: null,
      tenantEnv: null,
      title: "Livo Platform",
      isTenant: false,
      brandLogo: "/img/logo.svg",
      logoIcon: "/img/logo-icon.png",
      favicon: "/favicon.png",
      primaryColor: "#4ade80",
      secondaryColor: "#facc15",
      primaryColorAlt: "#fff",
      secondaryColorAlt: "#fff",
      backgroundColor: "#1f2937",
      linkColor: "#63b3ed",
    };
  }
  if (TENANT_ID) {
    const response = await fetch(TENANT_API_URL + "/tenants/" + TENANT_ID);
    const { data } = await response.json();

    tenant_data = {
      tenantId: data.data._id,
      tenantEnv: TENANT_ENV,
      title: data.data.title,
      isTenant: true,
      brandLogo: imageURL(data.data.styles.brandLogo),
      logoIcon: imageURL(data.data.styles.logoIcon),
      favicon: imageURL(data.data.styles.favicon),
      primaryColor: data.data.styles.primaryColor,
      secondaryColor: data.data.styles.secondaryColor,
      primaryColorAlt: data.data.styles.primaryColorAlt,
      secondaryColorAlt: data.data.styles.secondaryColorAlt,
      backgroundColor: data.data.styles.backgroundColor,
      linkColor: data.data.styles.linkColor,
    };
  }

  await createTenantConfig(tenant_data);
  await customizeTailwind({
    primaryColor: tenant_data.primaryColor,
    secondaryColor: tenant_data.secondaryColor,
    primaryColorAlt: tenant_data.primaryColorAlt,
    secondaryColorAlt: tenant_data.secondaryColorAlt,
    backgroundColor: tenant_data.backgroundColor,
    linkColor: tenant_data.linkColor,
  });
  await customizeIndexHtml({
    title: tenant_data.title,
    favicon: tenant_data.favicon,
    primaryColor: tenant_data.primaryColor,
    isTenant: tenant_data.isTenant,
  });

  process.exit(0);
}

async function createTenantConfig({
  tenantId,
  tenantEnv,
  brandLogo,
  logoIcon,
  title,
  favicon,
  primaryColor,
  secondaryColor,
  primaryColorAlt,
  secondaryColorAlt,
  backgroundColor,
  linkColor,
  isTenant,
}) {
  console.log(`\nCustomizing 'tenant-config.js'...`);
  const filePath = path.join(__dirname, "src", "tenant-config.js");
  const fileData = `
export const tenantId = "${tenantId}";
export const tenantEnv = "${tenantEnv}";
export const brandLogo = "${brandLogo}";
export const logoIcon = "${logoIcon}";
export const favicon = "${favicon}";
export const title = "${title}";
export const primaryColor = "${primaryColor}";
export const secondaryColor = "${secondaryColor}";
export const primaryColorAlt = "${primaryColorAlt}";
export const secondaryColorAlt = "${secondaryColorAlt}";
export const backgroundColor = "${backgroundColor}";
export const linkColor = "${linkColor}";
export const isTenant = ${isTenant};
`;
  await fs.writeFile(filePath, fileData, { encoding: "utf-8" });
  console.log(`\n'tenant-config.js' Customized...`);
}

async function customizeTailwind({
  primaryColor,
  secondaryColor,
  primaryColorAlt,
  secondaryColorAlt,
  linkColor,
  backgroundColor,
}) {
  console.log(`\nCustomizing 'tailwind.config.js'...`);

  const filePath = path.join(__dirname, "tailwind.config.js");
  const twConfigData = await fs.readFile(filePath, { encoding: "utf-8" });
  const twNewConfig = twConfigData
    .replace(/primary.*/, `primary": "${primaryColor}",`)
    .replace(/secondary.*/, `secondary": "${secondaryColor}",`)
    .replace(/background.*/, `background": "${backgroundColor}",`)
    .replace(/primary-alt.*/, `primary-alt": "${primaryColorAlt}",`)
    .replace(/secondary-alt.*/, `secondary-alt": "${secondaryColorAlt}",`)
    .replace(/link.*/, `link": "${linkColor}"`);

  await fs.writeFile(filePath, twNewConfig, { encoding: "utf-8" });
  console.log(`\n'tailwind.config.js' Customized...`);
}

async function customizeIndexHtml({ title, favicon, primaryColor, isTenant }) {
  console.log(`\nCustomizing 'index.html'...`);

  const filePath = path.join(__dirname, "index.html");
  const fileData = `
<!DOCTYPE html>
<html translate="no">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="${primaryColor}" />
    <meta name="description" content="${title}" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="cache-control" content="no-cache, no-store, must-revalidate" />
    <link rel="shortcut icon" href="${favicon}" />
    <meta name="apple-mobile-web-app-status-bar" content="${primaryColor}" />
    ${
      !isTenant
        ? `
    <link rel="apple-touch-icon" sizes="96x96" href="/img/icons/icon-96x96.png" />
    <link rel="manifest" href="/manifest.json" />
    `
        : ""
    }
    <title>${title}</title>
</head>
<body class="overflow-hidden">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>
`;

  await fs.writeFile(filePath, fileData, { encoding: "utf-8" });
  console.log(`\n'index.html' Customized...`);
}

function imageURL(image) {
  return "https://res.cloudinary.com/livo/image/upload/" + image;
}

customize();
