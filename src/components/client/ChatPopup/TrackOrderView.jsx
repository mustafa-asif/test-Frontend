import React, { useState } from "react";
import { xFetch } from "../../../utils/constants";
import { useToast } from "../../../hooks/useToast";
import { useTranslation } from "../../../i18n/provider";

const TRACK_TABS = {
  ORDER: "order",
  PHONE: "phone",
};

const TrackOrderView = ({ onOrderFound }) => {
  const tl = useTranslation();
  const [activeTab, setActiveTab] = useState(TRACK_TABS.ORDER);
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const showToast = useToast();

  const validatePhone = (phone) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, "");
    // Check if it's a valid Moroccan phone number (10 digits starting with 0)
    return cleaned.length === 10 && cleaned.startsWith("0");
  };

  const validateOrderNumber = (orderId) => {
    // Order IDs are typically alphanumeric
    return orderId.length >= 3;
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate input based on active tab
      if (activeTab === TRACK_TABS.PHONE) {
        if (!validatePhone(phone)) {
          setError(tl("invalid_phone"));
          setLoading(false);
          return;
        }
      } else {
        if (!validateOrderNumber(orderNumber)) {
          setError(tl("invalid_order_number"));
          setLoading(false);
          return;
        }
      }

      const query = activeTab === TRACK_TABS.PHONE ? `target.phone=${phone}` : `_id=${orderNumber}`;

      const { data, error: fetchError } = await xFetch(`/orders?${query}`);

      if (fetchError) {
        setError(tl("order_not_found"));
        return;
      }

      if (!data || data.length === 0) {
        setError(tl("order_not_found"));
        return;
      }

      // If multiple orders found, show the most recent one
      const mostRecentOrder = data.sort(
        (a, b) => new Date(b.timestamps.created) - new Date(a.timestamps.created),
      )[0];

      // Order found, pass it to parent if callback exists
      if (typeof onOrderFound === "function") {
        onOrderFound(mostRecentOrder);
        showToast(tl("order_found"), "success");
      } else {
        console.warn("onOrderFound callback not provided");
        showToast(tl("order_found_no_action"), "warning");
      }
    } catch (err) {
      console.error("Error tracking order:", err);
      setError(tl("unexpected_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-center font-semibold ${
            activeTab === TRACK_TABS.ORDER
              ? "text-blue-600 border-b-2 border-blue-600 bg-gray-50"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(TRACK_TABS.ORDER)}
        >
          {tl("order_number")}
        </button>
        <button
          className={`flex-1 py-3 text-center font-semibold ${
            activeTab === TRACK_TABS.PHONE
              ? "text-blue-600 border-b-2 border-blue-600 bg-gray-50"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab(TRACK_TABS.PHONE)}
        >
          {tl("phone_number")}
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <form className="w-full max-w-md flex flex-col gap-4" onSubmit={handleTrack}>
          {activeTab === TRACK_TABS.PHONE ? (
            <>
              <label className="text-sm font-medium text-gray-700">{tl("phone_number")}</label>
              <input
                type="tel"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 0612345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{10}"
                maxLength="10"
              />
            </>
          ) : (
            <>
              <label className="text-sm font-medium text-gray-700">{tl("order_number")}</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 1001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                minLength="3"
              />
            </>
          )}

          {error && (
            <div className="bg-red-50 rounded-lg p-4 flex flex-col items-center gap-2">
              <i className="fas fa-exclamation-circle text-red-500 text-2xl"></i>
              <p className="text-red-600 text-center">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                {tl("try_again")}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg px-3 py-2 font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-circle-notch fa-spin"></i>
                {tl("searching")}
              </>
            ) : (
              <>
                <i className="fas fa-search"></i>
                {tl("track_order")}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrackOrderView;
