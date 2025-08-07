import React from "react";
import { format } from "date-fns";
import { HumanDate } from "../shared/HumanDate";

const InfoSection = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 mb-4 sm:mb-2">
    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-700 break-words max-w-[180px] sm:max-w-none">{value}</p>
    </div>
  </div>
);

const SystemEventCard = ({ data, timestamp }) => {
  const { fingerprint, fingerprintData, user, type, phone, client, deliverer } = data;

  const getEventColor = (type) => {
    switch (type) {
      case "login_as_client":
        return "bg-green-100 text-green-800";
      case "phone_reveal":
        return "bg-yellow-100 text-yellow-800";
      case "deliverer_deactivated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getDeviceType = (fingerprintData) => {
    const { screen, system } = fingerprintData;
    const userAgent = system.useragent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
    const isTablet = /ipad|tablet/i.test(userAgent);
    const hasTouch = screen.is_touchscreen || screen.maxTouchPoints > 0;
    const isTouchOnly = screen.mediaMatches.some(match =>
      match.includes('any-pointer: coarse') || match.includes('pointer: coarse')
    );
    if (isTablet) return "Tablet";
    if (isMobile || (hasTouch && isTouchOnly)) return "Mobile";
    return "Desktop";
  };

  const getOSInfo = (userAgent) => {
    const ua = userAgent.toLowerCase();
    let os = "Unknown";
    let version = "";
    if (ua.includes("windows")) {
      os = "Windows";
      if (ua.includes("windows nt 10.0")) version = "10";
      else if (ua.includes("windows nt 6.3")) version = "8.1";
      else if (ua.includes("windows nt 6.2")) version = "8";
      else if (ua.includes("windows nt 6.1")) version = "7";
      else if (ua.includes("windows nt 6.0")) version = "Vista";
      else if (ua.includes("windows nt 5.1")) version = "XP";
      else if (ua.includes("windows nt 5.0")) version = "2000";
    }
    else if (ua.includes("macintosh") || ua.includes("mac os x")) {
      os = "macOS";
      const match = ua.match(/mac os x (\d+[._]\d+)/);
      if (match) version = match[1].replace("_", ".");
    }
    else if (ua.includes("iphone") || ua.includes("ipad")) {
      os = "iOS";
      const match = ua.match(/os (\d+[._]\d+)/);
      if (match) version = match[1].replace("_", ".");
    }
    else if (ua.includes("android")) {
      os = "Android";
      const match = ua.match(/android (\d+[._]\d+)/);
      if (match) version = match[1].replace("_", ".");
    }
    else if (ua.includes("linux")) {
      os = "Linux";
      if (ua.includes("ubuntu")) version = "Ubuntu";
      else if (ua.includes("fedora")) version = "Fedora";
      else if (ua.includes("debian")) version = "Debian";
      else if (ua.includes("centos")) version = "CentOS";
    }
    return `${os}${version ? ` ${version}` : ""}`;
  };

  const getDeviceInfo = (fingerprintData) => {
    const { system, hardware, screen } = fingerprintData;
    const deviceType = getDeviceType(fingerprintData);
    const os = getOSInfo(system.useragent);
    const browser = `${system.browser.name} ${system.browser.version}`;
    const userAgent = system.useragent;
    const isTouch = screen.is_touchscreen || screen.maxTouchPoints > 0;
    const screenInfo = `Touch: ${isTouch ? 'Yes' : 'No'}, Color Depth: ${screen.colorDepth}bit`;
    return {
      deviceType,
      os,
      browser,
      userAgent,
      screenInfo,
      renderer: hardware.videocard.renderer,
      memory: `${hardware.deviceMemory} GB`,
      cpuCores: system.hardwareConcurrency
    };
  };

  const deviceInfo = getDeviceInfo(fingerprintData);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 w-full max-w-xl mx-auto">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full overflow-x-auto">
              <code className="text-sm bg-gray-100 px-2 py-1 rounded break-all w-full sm:w-auto">{fingerprint}</code>
              <button
                onClick={() => navigator.clipboard.writeText(fingerprint)}
                className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
                title="Copy to clipboard"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 self-start sm:self-center ${getEventColor(type)} whitespace-nowrap`}>
            {type.replace(/_/g, " ").toUpperCase()}
          </span>
        </div>

        <div className="border-b border-gray-200 mb-4"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoSection
            icon="fa-user"
            label="User"
            value={`${user.name} (${user.role})`}
          />
          <InfoSection
            icon="fa-mobile-alt"
            label="Device Type"
            value={deviceInfo.deviceType}
          />
          <InfoSection
            icon="fa-desktop"
            label="Operating System"
            value={deviceInfo.os}
          />
          <InfoSection
            icon="fa-globe"
            label="Browser"
            value={deviceInfo.browser}
          />
          <InfoSection
            icon="fa-microchip"
            label="Graphics"
            value={deviceInfo.renderer}
          />
          <InfoSection
            icon="fa-memory"
            label="Memory"
            value={deviceInfo.memory}
          />
          <InfoSection
            icon="fa-microchip"
            label="CPU Cores"
            value={deviceInfo.cpuCores}
          />
          <InfoSection
            icon="fa-desktop"
            label="Screen"
            value={deviceInfo.screenInfo}
          />
          <InfoSection
            icon="fa-clock"
            label="Timestamp"
            value={
              <div className="flex flex-col">
                <span>{format(new Date(timestamp), "PPpp")}</span>
                <span className="text-sm text-gray-500">
                  <HumanDate date={new Date(timestamp)} long />
                </span>
              </div>
            }
          />
        </div>

        <div className="mt-4">
          <div className="border-b border-gray-200 mb-4"></div>
          <InfoSection
            icon="fa-info-circle"
            label="User Agent"
            value={deviceInfo.userAgent}
          />
        </div>

        {type === "login_as_client" && (
          <div className="mt-4">
            <div className="border-b border-gray-200 mb-4"></div>
            <InfoSection
              icon="fa-building"
              label="Client Logged In"
              value={client.name}
            />
          </div>
        )}

        {type === "phone_reveal" && (
          <div className="mt-4">
            <div className="border-b border-gray-200 mb-4"></div>
            <InfoSection
              icon="fa-phone"
              label="Phone Number"
              value={phone}
            />
          </div>
        )}

        {type === "deliverer_deactivated" && (
          <div className="mt-4">
            <div className="border-b border-gray-200 mb-4"></div>
            <InfoSection
              icon="fa-user"
              label="Deactivated Deliverer"
              value={`${deliverer.name} (${deliverer.phone})`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemEventCard; 