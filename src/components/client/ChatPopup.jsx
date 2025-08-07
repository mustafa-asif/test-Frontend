import React, { useState, useEffect, useRef } from "react";
import ChatView from "./ChatPopup/ChatView";
import TrackOrderView from "./ChatPopup/TrackOrderView";
import HistoryView from "./ChatPopup/HistoryView";
import OrderChatView from "./ChatPopup/OrderChatView";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useUpdates } from "../../hooks/useUpdates";
import useFirstVisit from "../../hooks/useFirstVisit";
import { StatusDisplay } from "../shared/StatusDisplay";
import { useTranslation } from "../../i18n/provider";

// Constants for availability
const AVAILABILITY = {
  START_TIME: "09:30",
  END_TIME: "18:00",
};

// Custom hook to check if support is available
const useAvailability = () => {
  const [isAvailable, setIsAvailable] = useState(() => {
    const now = new Date();
    const currentTime =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    // Don't consider available on weekends
    if (now.getDay() === 0 || now.getDay() === 6) return false;

    return currentTime >= AVAILABILITY.START_TIME && currentTime < AVAILABILITY.END_TIME;
  });

  // Update availability every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      // Don't consider available on weekends
      if (now.getDay() === 0 || now.getDay() === 6) {
        setIsAvailable(false);
        return;
      }

      setIsAvailable(currentTime >= AVAILABILITY.START_TIME && currentTime < AVAILABILITY.END_TIME);
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  return {
    isAvailable,
    startTime: AVAILABILITY.START_TIME,
    endTime: AVAILABILITY.END_TIME,
  };
};

const VIEW = {
  MAIN: "main",
  TRACK: "track",
  CHAT: "chat",
  ORDER_CHAT: "order_chat",
};

const TABS = {
  WELCOME: "welcome",
  HISTORY: "conversations",
};

const ChatPopup = () => {
  const tl = useTranslation();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(VIEW.MAIN);
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [tab, setTab] = useState(TABS.WELCOME);
  const [historyTicket, setHistoryTicket] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [currentTicketId, setCurrentTicketId] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const user = useStoreState((state) => state.auth.user);
  const { isAvailable, startTime, endTime } = useAvailability();
  const popupRef = useRef(null);

  // Get store state and actions
  const tickets = useStoreState((state) => state.tickets.tickets);
  const addTicket = useStoreActions((actions) => actions.tickets.addTicket);
  const startListeningWS = useUpdates("tickets");

  // Reset category selection when switching tabs or closing popup
  useEffect(() => {
    if (!open || tab !== TABS.WELCOME || view !== VIEW.CHAT) {
      setSelectedCategory("");
      setSelectedSubCategory("");
    }
  }, [open, tab, view]);

  // Update current ticket ID when switching views or tickets
  useEffect(() => {
    if (historyTicket) {
      setCurrentTicketId(historyTicket._id);
      // Add the ticket to the store if it's not already there
      if (!tickets?.find(t => t._id === historyTicket._id)) {
        addTicket(historyTicket);
      }
    } else if (view === VIEW.CHAT && tab === TABS.WELCOME) {
      const ticket = tickets?.find(
        (t) =>
          t.messages?.length > 0 &&
          t.messages[t.messages.length - 1]?.text === (selectedSubCategory || selectedCategory),
      );
      if (ticket) {
        setCurrentTicketId(ticket._id);
      }
    } else {
      setCurrentTicketId(null);
    }
  }, [historyTicket, view, tab, tickets, selectedCategory, selectedSubCategory, addTicket]);

  // Calculate unread count whenever tickets change
  useEffect(() => {
    if (!tickets) return;

    const count = tickets.filter((ticket) => {
      // Skip the currently viewed ticket
      if (ticket._id === currentTicketId) return false;

      const lastMsg =
        ticket.messages && ticket.messages.length > 0
          ? ticket.messages[ticket.messages.length - 1]
          : null;
      return (
        lastMsg &&
        lastMsg.user?.role === "followup" &&
        !lastMsg.seen?.some((s) => s.user._id === user._id)
      );
    }).length;

    setUnreadCount(count);
  }, [tickets, user._id, currentTicketId]);

  // Start listening for updates when popup opens
  useFirstVisit(() => {
    if (open) {
      startListeningWS();
    }
  }, [open]);

  const handleTrack = (e) => {
    e.preventDefault();
    alert(`Track order: ${orderNumber}, phone: ${phone}`);
  };

  const handleOrderFound = (order) => {
    setCurrentOrder(order);
    setView(VIEW.ORDER_CHAT);
  };

  // If a ticket is selected from history, show chat for that ticket
  const showHistoryChat = !!historyTicket;

  return (
    <>
      {/* Floating button */}
      <button
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg flex items-center justify-center"
        onClick={() => setOpen(!open)}
        aria-label={open ? tl("close_support_popup") : tl("open_support_popup")}
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
      >
        <i className="fas fa-comments text-2xl"></i>
      </button>

      {/* Popup/modal */}
      {open && (
        <div
          ref={popupRef}
          className="fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100"
          style={{
            width: "370px",
            maxWidth: "95vw",
            height: "650px",
            minHeight: "500px",
            maxHeight: "95vh",
            transition: "all 0.2s",
            display: "flex",
          }}
        >
          {/* Header */}
          <div className="flex items-center px-6 pt-6 pb-4 flex-shrink-0 relative border-b">
            {/* Welcome Tab */}
            {view === VIEW.MAIN && tab === TABS.WELCOME && !showHistoryChat && (
              <div>
                <div className="text-2xl font-semibold flex items-center gap-2">
                  {tl("hi")}{" "}
                  {user?.name?.split(" ")[0]?.charAt(0).toUpperCase() +
                    user?.name?.split(" ")[0]?.slice(1).toLowerCase()}{" "}
                  <span role="img" aria-label="wave">
                    👋
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">{tl("how_can_we_help")}</div>
              </div>
            )}

            {/* History Tab */}
            {view === VIEW.MAIN && tab === TABS.HISTORY && !showHistoryChat && (
              <div>
                <div className="text-2xl font-semibold">{tl("conversations")}</div>
                <div className="text-sm text-gray-500 mt-1">{tl("support_history")}</div>
              </div>
            )}

            {/* Chat View */}
            {view === VIEW.CHAT && !showHistoryChat && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setView(VIEW.MAIN)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-arrow-left text-xl"></i>
                </button>
                <div>
                  <div className="text-2xl font-semibold">{tl("support_chat")}</div>
                  <div className="text-sm text-gray-500 mt-1">{tl("we_are_here_to_help")}</div>
                </div>
              </div>
            )}

            {/* Order Chat View */}
            {view === VIEW.ORDER_CHAT && currentOrder && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setCurrentOrder(null);
                    setView(VIEW.MAIN);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-arrow-left text-xl"></i>
                </button>
                <div>
                  <div className="text-2xl font-semibold">{tl("order_chat")}</div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span>Order {currentOrder._id}</span>
                    <StatusDisplay model="orders" status={currentOrder.status} />
                  </div>
                </div>
              </div>
            )}

            {/* Track Order View */}
            {view === VIEW.TRACK && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setView(VIEW.MAIN)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-arrow-left text-xl"></i>
                </button>
                <div>
                  <div className="text-2xl font-semibold">{tl("track_order")}</div>
                  <div className="text-sm text-gray-500 mt-1">{tl("enter_order_details")}</div>
                </div>
              </div>
            )}

            {/* History Chat View */}
            {showHistoryChat && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setHistoryTicket(null);
                    setView(VIEW.MAIN);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-arrow-left text-xl"></i>
                </button>
                <div>
                  <div className="text-2xl font-semibold">{tl("conversations")}</div>
                  <div className="text-sm text-gray-500 mt-1">{tl("back_to_conversations")}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {tab === TABS.WELCOME && !showHistoryChat && view === VIEW.MAIN && (
              <>
                {/* Contact Us Section */}
                <div className="bg-gray-50 rounded-xl mx-4 mt-4 p-4 flex flex-col gap-3">
                  <div className="font-semibold text-gray-900 mb-1">{tl("contact_us")}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${isAvailable ? "bg-green-500" : "bg-yellow-500"}`}
                    ></span>
                    <span>{isAvailable ? tl("we_are_online") : tl("we_are_offline")}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {tl("available")}: {startTime} - {endTime}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg px-3 py-2 font-medium hover:bg-green-700 transition"
                      onClick={() => setView(VIEW.CHAT)}
                    >
                      <i className="fas fa-comments text-base"></i> {tl("chat_now")}
                    </button>
                  </div>
                </div>

                {/* Order Tracking Section */}
                <button
                  className="bg-gray-50 rounded-xl mx-4 mt-4 p-4 w-auto flex flex-col text-left hover:bg-gray-100 transition"
                  onClick={() => setView(VIEW.TRACK)}
                >
                  <div className="font-semibold text-gray-900 flex items-center justify-between">
                    {tl("order_tracking")}
                    <i className="fas fa-chevron-right text-gray-400"></i>
                  </div>
                  <div className="text-gray-500 text-sm mt-1">{tl("track_your_orders")}</div>
                </button>
              </>
            )}
            {tab === TABS.WELCOME && !showHistoryChat && view === VIEW.CHAT && (
              <ChatView
                onBack={() => setView(VIEW.MAIN)}
                selectedCategory={selectedCategory}
                selectedSubCategory={selectedSubCategory}
                onCategorySelect={(cat, subcat) => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory(subcat || "");
                }}
              />
            )}
            {tab === TABS.WELCOME && !showHistoryChat && view === VIEW.TRACK && (
              <TrackOrderView onBack={() => setView(VIEW.MAIN)} onOrderFound={handleOrderFound} />
            )}
            {view === VIEW.ORDER_CHAT && currentOrder && (
              <OrderChatView
                order={currentOrder}
                onBack={() => {
                  setCurrentOrder(null);
                  setView(VIEW.MAIN);
                }}
              />
            )}
            {tab === TABS.HISTORY && !showHistoryChat && (
              <HistoryView
                onSelect={(ticket) => {
                  setHistoryTicket(ticket);
                  setTab(TABS.HISTORY);
                  setView(VIEW.CHAT);
                }}
                showUnreadBadge={setUnreadCount}
              />
            )}
            {showHistoryChat && (
              <ChatView
                onBack={() => {
                  setHistoryTicket(null);
                  setView(VIEW.MAIN);
                }}
                ticketId={historyTicket._id}
              />
            )}
          </div>

          {/* Tab bar */}
          <div className="flex border-t border-gray-200">
            <button
              className={`flex-1 py-3 text-center font-semibold ${tab === TABS.WELCOME ? "text-green-600 border-b-2 border-green-600 bg-gray-50" : "text-gray-500"}`}
              onClick={() => {
                setTab(TABS.WELCOME);
                setHistoryTicket(null);
                setView(VIEW.MAIN);
              }}
            >
              {tl("welcome")}
            </button>
            <button
              className={`flex-1 py-3 text-center font-semibold relative ${tab === TABS.HISTORY ? "text-green-600 border-b-2 border-green-600 bg-gray-50" : "text-gray-500"}`}
              onClick={() => {
                setTab(TABS.HISTORY);
                setView(VIEW.MAIN);
              }}
            >
              {tl("conversations")}
              {unreadCount > 0 && (
                <span className="absolute top-2 right-6 bg-yellow-500 text-white rounded-full px-2 py-0.5 text-xs font-bold animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPopup;
