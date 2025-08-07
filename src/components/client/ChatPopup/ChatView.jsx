import React, { useEffect, useRef, useState } from "react";
import { Input } from "../../shared/Input";
import { Button } from "../../shared/Button";
import { useToast } from "../../../hooks/useToast";
import { xFetch } from "../../../utils/constants";
import { FileInput } from "../../shared/FileInput";
import { AudioRecord } from "../../shared/AudioRecord";
import { Image as ImagePreview } from "../../shared/Image";
import { Audio as AudioPreview } from "../../shared/Audio";
import { HumanDate } from "../../shared/HumanDate";
import SupportCategorySelector from "../../shared/SupportCategorySelector";
import { useStoreActions, useStoreState } from "easy-peasy";
import { xUploadImage, xUploadAudio } from "../../../utils/misc";
import { useUpdates } from "../../../hooks/useUpdates";
import useFirstVisit from "../../../hooks/useFirstVisit";
import { RatingComponent } from "../../shared/Rating";
import MessageText from "./MessageText";
import { useTranslation } from "../../../i18n/provider";

const ChatView = ({ 
  ticketId: propTicketId, 
  selectedCategory: propSelectedCategory,
  selectedSubCategory: propSelectedSubCategory,
  onCategorySelect,
}) => {
  const tl = useTranslation();
  const [ticketId, setTicketId] = useState(propTicketId || null);
  const [isLoading, setLoading] = useState(false);
  const [contentType, setContentType] = useState("text");
  const [text, setText] = useState("");
  const [localImage, setLocalImage] = useState(null);
  const [localAudio, setLocalAudio] = useState(null);
  const [isSending, setSending] = useState(false);
  const [supportCategories, setSupportCategories] = useState({});
  const showToast = useToast();
  const chatEndRef = useRef(null);

  // Get store actions/state
  const startListeningWS = useUpdates("tickets");
  const user = useStoreState((state) => state.auth.user);
  const addMessages = useStoreActions((actions) => actions.tickets.addMessages);
  const addTicket = useStoreActions((actions) => actions.tickets.addTicket);
  const ticket = useStoreState((state) => state.tickets.tickets?.find((t) => t._id === ticketId));

  useFirstVisit(function () {
    startListeningWS();
  }, []);

  // Fetch support categories
  useEffect(() => {
    async function fetchSupportCategories() {
      const { data, error } = await xFetch(
        "/supportCategories/matching",
        undefined,
        undefined,
        undefined,
        ["page_path=/tickets"],
      );
      if (error) return;
      let formatted = {};
      data.forEach((item) => {
        formatted[item.category] = item.sub_categories;
      });
      setSupportCategories(formatted);
    }
    fetchSupportCategories();
  }, []);

  // Fetch initial messages and mark as seen
  useEffect(() => {
    if (!ticketId) {
      return;
    }

    async function fetchMessages() {
      setLoading(true);
      const { data, error } = await xFetch(`/tickets/${ticketId}/messages`);
      setLoading(false);

      if (error) {
        console.error("Error fetching messages:", error);
        return showToast(error, "error");
      }

      if (data?.length > 0) {
        // Update store with initial messages
        addMessages({
          _id: ticketId,
          messages: data,
          prepend: true,
          override: true,
        });

        // Mark unseen messages as seen
        const unseenMessages = data.filter(
          (msg) => !msg.seen?.some((seen) => seen.user._id === user._id),
        );
        if (unseenMessages.length) {
          await xFetch(`/tickets/${ticketId}/messages`, {
            method: "PATCH",
            body: { messages: unseenMessages.map((msg) => msg._id) },
          });
        }
      }
    }

    fetchMessages();
  }, [ticketId, user._id, addMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  // Mark new messages as seen when they arrive
  useEffect(() => {
    if (!ticketId || !ticket?.messages?.length) return;

    const unseenMessages = ticket.messages.filter(
      (msg) => !msg.seen?.some((seen) => seen.user._id === user._id)
    );

    if (unseenMessages.length) {
      xFetch(`/tickets/${ticketId}/messages`, {
        method: "PATCH",
        body: { messages: unseenMessages.map((msg) => msg._id) },
      });
    }
  }, [ticketId, ticket?.messages, user._id]);

  // Handle message sending
  async function handleSend(e) {
    if (e) e.preventDefault();
    if (isSending) return;
    if (contentType === "text" && !text.trim()) return;
    if (contentType === "image" && !localImage) return;
    if (contentType === "audio" && !localAudio) return;
    setSending(true);
    let media;

    if (contentType === "image") {
      const { data, error } = await xUploadImage(localImage);
      if (error) {
        setSending(false);
        showToast(error, "error");
        return;
      }
      media = { kind: "image", link: data };
    }

    if (contentType === "audio") {
      const { data, error } = await xUploadAudio(localAudio);
      if (error) {
        setSending(false);
        showToast(error, "error");
        return;
      }
      media = { kind: "audio", link: data };
    }

    const { error } = await xFetch(`/tickets/${ticketId}/messages`, {
      method: "POST",
      body: { text: text || contentType, media },
    });
    setSending(false);
    if (error) return showToast(error, "error");
    setText("");
    setContentType("text");
    setLocalImage(null);
    setLocalAudio(null);
  }

  // Show support category selection if no ticket yet
  if (!ticketId && !propTicketId) {
    const canStart =
      propSelectedCategory &&
      (supportCategories[propSelectedCategory]?.length === 0 || propSelectedSubCategory);
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="w-full max-w-md mx-auto">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!canStart)
                  return showToast(tl("please_select_category"), "error");
                setLoading(true);
                const { error, data } = await xFetch("/tickets", {
                  method: "POST",
                  body: {
                    title: "Reclamation",
                  },
                });
                if (error || !data?._id) {
                  setLoading(false);
                  showToast(error || tl("could_not_create_ticket"), "error");
                  return;
                }

                // Add the ticket to the store first
                addTicket(data);

                // Immediately send the category/subcategory as the first message
                const firstMessage = propSelectedSubCategory || propSelectedCategory;
                const { error: messageError, data: messageData } = await xFetch(`/tickets/${data._id}/messages`, {
                  method: "POST",
                  body: { text: firstMessage },
                });

                if (messageError) {
                  setLoading(false);
                  showToast(messageError, "error");
                  return;
                }

                // Add the message to the store
                addMessages({
                  _id: data._id,
                  messages: [messageData],
                  prepend: true,
                });

                // Set the ticket ID to show the chat view
                setTicketId(data._id);
                setLoading(false);
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-md font-medium text-gray-700 mb-2">
                  {tl("support_category")}
                </label>
                <div className="max-h-[60vh] overflow-y-auto">
                  <SupportCategorySelector
                    supportCategories={supportCategories}
                    handleSupportCategorySend={(cat, subcat) => {
                      onCategorySelect(cat, subcat);
                    }}
                  />
                </div>
              </div>
              <Button
                label={isLoading ? tl("starting") : tl("start_chat")}
                type="submit"
                isLoading={isLoading}
                disabled={!canStart || isLoading}
              />
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4" style={{ background: "#fff" }}>
        {/* Date header */}
        <div className="flex items-center justify-center text-xs text-gray-400 mb-4">
          <span className="border-b border-gray-200 flex-1 mr-2"></span>
          {new Date().toLocaleDateString()}
          <span className="border-b border-gray-200 flex-1 ml-2"></span>
        </div>
        {!ticket && (
          <div className="text-center text-gray-500 mb-4">{tl("loading_ticket")}</div>
        )}
        {ticket?.messages?.map((msg, idx) => {
          // Skip internal messages for clients
          if (msg.internal && user?.role === "client") return null;
          
          return (
            <div
              key={msg._id || idx}
              className={`flex mb-4 ${msg.user?.role === "client" ? "justify-end" : ""}`}
            >
              {msg.user?.role !== "client" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  <i className="fas fa-user text-gray-500"></i>
                </div>
              )}
              <div
                className={
                  msg.user?.role === "client"
                    ? "bg-green-100 text-black rounded-2xl px-4 py-2 max-w-[75%] flex flex-col"
                    : "bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 max-w-[75%] flex flex-col"
                }
                style={{ wordBreak: "break-word" }}
              >
                <div className="flex flex-col gap-2">
                  {(msg.media?.kind === "image" || msg.media?.kind === "audio") && (
                    <div className="flex items-center">
                      {msg.media.kind === "image" ? (
                        <ImagePreview public_id={msg.media.link} className="max-w-[200px] rounded-lg" />
                      ) : (
                        <AudioPreview public_id={msg.media.link} />
                      )}
                    </div>
                  )}
                  {msg.text && <MessageText text={msg.text} />}
                </div>
                <div className="text-xs mt-1 opacity-70">
                  <HumanDate date={msg.timestamps?.created || msg.created_at} />
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200">
        {/* Rating section */}
        <div className="px-4 py-3 bg-gray-50">
          <RatingComponent
            type="support"
            _id={ticketId}
            model="tickets"
            rating={ticket?.rating?.support}
            disabled={["followup", "warehouse"].includes(user?.role)}
          />
        </div>

        <div className="px-4 py-3">
          <form onSubmit={handleSend}>
            <div className="flex items-center gap-2">
              {contentType === "text" && (
                <Input
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={tl("type_your_message")}
                  value={text}
                  onValueChange={setText}
                  disabled={isSending}
                />
              )}
              {contentType === "image" && (
                <div className="flex-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setContentType("text")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <FileInput
                    file={localImage}
                    setFile={setLocalImage}
                    disabled={isSending}
                    accept=".png, .jpg, .jpeg"
                    className="flex-1"
                  />
                </div>
              )}
              {contentType === "audio" && (
                <div className="w-[calc(100%-125px)] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setContentType("text")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>

                  <div className={localAudio ? "w-[calc(100%-20px)]" : "flex-1"}>
                    <AudioRecord audio={localAudio} setAudio={setLocalAudio} disabled={isSending} />
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setContentType("image")}
                  className={`p-2 rounded-lg ${contentType === "image" ? "bg-green-100 text-green-600" : "text-gray-500 hover:text-gray-700"}`}
                  disabled={isSending}
                >
                  <i className="fas fa-image text-lg"></i>
                </button>
                <button
                  type="button"
                  onClick={() => setContentType("audio")}
                  className={`p-2 rounded-lg ${contentType === "audio" ? "bg-green-100 text-green-600" : "text-gray-500 hover:text-gray-700"}`}
                  disabled={isSending}
                >
                  <i className="fas fa-microphone text-lg"></i>
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 flex-shrink-0 h-[42px] w-[42px] justify-center"
                  disabled={isSending}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
