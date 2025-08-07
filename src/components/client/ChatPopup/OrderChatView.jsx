import React, { useState, useEffect, useRef } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import { xFetch } from "../../../utils/constants";
import { useToast } from "../../../hooks/useToast";
import { HumanDate } from "../../shared/HumanDate";
import { useUpdates } from "../../../hooks/useUpdates";
import useFirstVisit from "../../../hooks/useFirstVisit";
import { Input } from "../../shared/Input";
import { FileInput } from "../../shared/FileInput";
import { AudioRecord } from "../../shared/AudioRecord";
import { Image as ImagePreview } from "../../shared/Image";
import { Audio as AudioPreview } from "../../shared/Audio";
import { xUploadImage, xUploadAudio } from "../../../utils/misc";
import { RatingComponent } from "../../shared/Rating";
import MessageText from "./MessageText";
import { useTranslation } from "../../../i18n/provider";

const OrderChatView = ({ order, onBack }) => {
  const tl = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const [contentType, setContentType] = useState("text");
  const [localImage, setLocalImage] = useState(null);
  const [localAudio, setLocalAudio] = useState(null);
  const [isSending, setSending] = useState(false);
  const showToast = useToast();
  const messagesEndRef = useRef(null);
  
  // Get store actions/state
  const startListeningWS = useUpdates("orders");
  const user = useStoreState((state) => state.auth.user);
  const addMessages = useStoreActions((actions) => actions.orders.addMessages);
  const currentOrder = useStoreState((state) => 
    state.orders.orders.find((o) => o._id === order._id)
  );
  const messages = currentOrder?.messages || [];

  // Start WebSocket listener
  useFirstVisit(() => {
    startListeningWS();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (order) {
      fetchMessages();
    }
  }, [order]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await xFetch(`/orders/${order._id}/messages`);
      if (fetchError) {
        setError(tl("failed_to_load_messages"));
        return;
      }
      
      // Update store with initial messages
      addMessages({
        _id: order._id,
        messages: data || [],
        prepend: true,
        override: true,
      });
    } catch (err) {
      setError(tl("error_loading_messages"));
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (isSending) return;
    if (contentType === "text" && !newMessage.trim()) return;
    if (contentType === "image" && !localImage) return;
    if (contentType === "audio" && !localAudio) return;

    setSending(true);
    let media;

    try {
      // Handle image upload
      if (contentType === "image") {
        const { data, error } = await xUploadImage(localImage);
        if (error) {
          showToast(error, "error");
          return;
        }
        media = { kind: "image", link: data };
      }

      // Handle audio upload
      if (contentType === "audio") {
        const { data, error } = await xUploadAudio(localAudio);
        if (error) {
          showToast(error, "error");
          return;
        }
        media = { kind: "audio", link: data };
      }

      // Send message
      const { data: messageData, error: sendError } = await xFetch(`/orders/${order._id}/messages`, {
        method: "POST",
        body: { text: newMessage || contentType, media },
      });

      if (sendError) {
        setError(tl("failed_to_send_message"));
        return;
      }

      // Add message to store
      addMessages({
        _id: order._id,
        messages: [messageData],
        prepend: false,
      });
      
      // Reset form
      setNewMessage("");
      setContentType("text");
      setLocalImage(null);
      setLocalAudio(null);
      showToast(tl("message_sent_successfully"), "success");
    } catch (err) {
      setError(tl("error_sending_message"));
      showToast(tl("failed_to_send_message"), "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <i className="fas fa-circle-notch fa-spin text-2xl text-gray-400"></i>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            {tl("no_messages_yet")}
          </div>
        ) : (
          messages.map((message, index) => {
            // Skip internal messages for clients
            if (message.internal && user?.role === "client") return null;
            
            return (
              <div
                key={message._id || index}
                className={`flex mb-4 ${message.user._id === user._id ? "justify-end" : ""}`}
              >
                {message.user._id !== user._id && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                    <i className="fas fa-user text-gray-500"></i>
                  </div>
                )}
                <div
                  className={
                    message.user._id === user._id
                      ? "bg-green-100 text-black rounded-2xl px-4 py-2 max-w-[75%] flex flex-col"
                      : "bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 max-w-[75%] flex flex-col"
                  }
                  style={{ wordBreak: "break-word" }}
                >
                  <div className="flex flex-col gap-2">
                    {(message.media?.kind === "image" || message.media?.kind === "audio") && (
                      <div className="flex items-center">
                        {message.media.kind === "image" ? (
                          <ImagePreview public_id={message.media.link} className="max-w-[200px] rounded-lg" />
                        ) : (
                          <AudioPreview public_id={message.media.link} />
                        )}
                      </div>
                    )}
                    {message.text && <MessageText text={message.text} />}
                  </div>
                  <div className="text-xs mt-1 opacity-70">
                    <HumanDate date={message.timestamps?.created || message.created_at} />
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200">
        {/* Rating section */}
        <div className="px-4 py-3 bg-gray-50">
          <RatingComponent
            type="order"
            _id={order._id}
            model="orders"
            rating={order?.rating?.order}
            disabled={["followup", "warehouse"].includes(user?.role)}
          />
        </div>

        <div className="p-4">
          <form onSubmit={handleSendMessage}>
            <div className="flex items-center gap-2">
              {contentType === "text" && (
                <Input
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={tl("type_your_message")}
                  value={newMessage}
                  onValueChange={setNewMessage}
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
                  {isSending ? (
                    <i className="fas fa-circle-notch fa-spin"></i>
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderChatView;