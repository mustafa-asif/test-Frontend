import { useStoreState } from "easy-peasy";
import { Fragment, useEffect, useState } from "react";
import { useFeedScroll } from "../../hooks/useFeedScroll";
import { useToast } from "../../hooks/useToast";
import { useTranslation } from "../../i18n/provider";
import { imgSrc, xFetch } from "../../utils/constants";
import { cl, getMostRecentTimestamp, xUploadAudio, xUploadImage } from "../../utils/misc";
import { HumanDate } from "./HumanDate";
import { Input } from "./Input";
import { useQuickEditor } from "../shared/ToolsProvider";
import { Copyable } from "../shared/Copyable";
import { Pin } from "../shared/Pin";
import { useConfirmation } from "../shared/ToolsProvider";
import { Tags } from "./Tags";
import { MessageStatusMenu } from "./MessageStatusMenu";
import { SavedTexts } from "../followup/SavedTexts";
import { AttachmentButton } from "./AttachmentButton";
import { FileInput } from "./FileInput";
import { Image } from "./Image";
import { AudioRecord } from "./AudioRecord";
import { Audio } from "./Audio";
import { ThumbsUpDown } from "./ThumsUpDown";
import { RatingComponent } from "./Rating";
import { Whatsapp } from "./Whatsapp";
import SupportCategorySelector from "./SupportCategorySelector";
import { Pic } from "./Pic";
import HiddenPhone from "./HiddenPhone";

export const MessagesView = ({
  model,
  _id,
  status,
  messages,
  tags,
  pinned,
  isFullScreen = false,
  rating,
  warehouseCity,
  deliverer,
  supportCategories,
}) => {
  const [contentType, setContentType] = useState("text");
  const [isSaving, editDocument] = useQuickEditor(_id, model);
  const [isSending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [localImage, setLocalImage] = useState(null);
  const [localAudio, setLocalAudio] = useState(null);
  const [assignedWarehouse, setAssignedWarehouse] = useState(null);
  const [isInternal, setIsInternal] = useState(false);

  const role = useStoreState((state) => state.auth.user?.role);
  const authUser = useStoreState((state) => state.auth.user);

  const containerRef = useFeedScroll([messages.length]);
  const showToast = useToast();
  const tl = useTranslation();

  async function handleSend(e) {
    e.preventDefault();
    if (contentType === "text" && !text) return;
    if (contentType === "image" && !localImage) return;
    if (contentType === "audio" && !localAudio) return;

    setSending(true);
    let media;

    if (contentType === "image") {
      const { data, error } = await xUploadImage(localImage);

      if (error) {
        setSending(false);
        return showToast(error, "error");
      }
      media = { kind: "image", link: data };
    }

    if (contentType === "audio") {
      const { data, error } = await xUploadAudio(localAudio);

      if (error) {
        setSending(false);
        return showToast(error, "error");
      }
      media = { kind: "audio", link: data };
    }

    const { error } = await xFetch(`/${model}/${_id}/messages`, {
      method: "POST",
      body: { text: text || contentType, media, internal: isInternal },
    });
    setSending(false);
    if (error) {
      return showToast(error, "error");
    }
    showToast("success", "success");
    setText("");
    setContentType("text");
    setLocalImage(null);
    setLocalAudio(null);
    setIsInternal(false);
  }

  async function handleSupportCategorySend(category, subCategory) {
    //Send selected category/sub-category as message if only role is client
    if (role === "client") {
      setSending(true);
      const { error } = await xFetch(`/${model}/${_id}/messages`, {
        method: "POST",
        body: { text: subCategory || category, category, sub_category: subCategory },
      });
      setSending(false);
      if (error) {
        return showToast(error, "error");
      }
      showToast("success", "success");
    }
    //for client and followup both
    editDocument({ support_request: { category, sub_category: subCategory } });
  }

  const disabled = isSending;
  const disableRating = ["followup", "warehouse"].includes(role);

  const fetchDocument = async () => {
    const { data } = await xFetch(`/warehouses/cities/${warehouseCity}`);
    setAssignedWarehouse(data);
  };

  useEffect(() => {
    if (warehouseCity) fetchDocument();
  }, [warehouseCity]);

  function SendButton() {
    return (
      <div
        className={cl(
          "w-12 h-12 flex items-center justify-center bg-green-500 rounded-full text-white px-4 py-1 shrink-0",
          { "hover:bg-green-600 hover:shadow-md cursor-pointer": !disabled },
          { "pointer-events-none opacity-70": disabled }
        )}
        onClick={handleSend}
        disabled={disabled}>
        {isSending ? (
          <div
            style={{ borderTopColor: "#FBBF24" }}
            className="rounded-full border-4 border-t-4 border-white h-6 w-6 animate-spin absolute"></div>
        ) : (
          <i className="fas fa-paper-plane text-xl"></i>
        )}
      </div>
    );
  }

  function BackToTextBtn() {
    const promptConfirm = useConfirmation();
    const tl = useTranslation();

    function handleClick() {
      if (!localImage && !localAudio) return setContentType("text");
      return promptConfirm({
        title: tl("discard upload"),
        onConfirm: () => {
          setLocalImage(null);
          setLocalAudio(null);
          setContentType("text");
        },
      });
    }
    return (
      <div
        className={cl(
          "w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-green px-4 py-1 shrink-0",
          { "hover:shadow-md cursor-pointer": !disabled },
          { "pointer-events-none opacity-70": disabled }
        )}
        onClick={handleClick}
        disabled={disabled}>
        <i className="fas fa-comments text-xl"></i>
      </div>
    );
  }

  function MarkDoneBtn() {
    const tl = useTranslation();
    async function handleClick() {
      const { error } = await xFetch(`/${model}/${_id}/messages/done`, {
        method: "PATCH",
        body: {},
      });
      if (error) {
        return showToast(error, "error");
      }
      showToast(tl("Marked as Done"), "success");
    }
    return (
      <div
        className={cl(
          "w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-green px-4 py-1 shrink-0",
          { "hover:shadow-md cursor-pointer": !disabled },
          { "pointer-events-none opacity-70": disabled }
        )}
        onClick={handleClick}
        disabled={disabled}>
        <i className="fas fa-check text-xl"></i>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-auto min-h-full rounded-md bg-gray-100">
      <div
        className="flex flex-col h-full shadow-inner pt-6 pb-6 overflow-y-scroll"
        ref={containerRef}>
        <div className="flex flex-col h-full">
          {role !== "client" && (
            <div className="col-span-4 flex justify-between items-center whitespace-nowrap text-xl pb-4 mx-3 border-b">
              <div className="flex gap-x-2 items-center">
                <span className="">
                  <Copyable text={_id} />
                </span>
                {tags && (
                  <Tags
                    value={tags}
                    onChange={(tags) => editDocument({ tags })}
                    isLoading={isSaving}
                    canEdit
                    canRemove
                    className="bg-gray-200"
                  />
                )}
              </div>
              <div className="flex gap-x-1 items-center">
                <Pin value={pinned} onChange={(pinned) => editDocument({ pinned })} />
              </div>
            </div>
          )}
          {model === "orders" &&
            role == "client" &&
            authUser.client.display_warehouse_deliverer_contact &&
            assignedWarehouse?.warehouse.options?.display_warehouse_deliverer_contact &&
            (assignedWarehouse?.phone || deliverer?.phone) && (
              <>
                <div className="flex items-center">
                  <div className="h-10 flex items-center ml-4">
                    <span className="line-clamp-1 px-2">
                      {deliverer?.phone ? "Deliverer" : "Warehouse"} Contact No:
                    </span>
                  </div>
                  <HiddenPhone
                    phone={deliverer?.phone ?? assignedWarehouse?.phone}
                    className="text-blue-600 hover:text-blue-800"
                    isDelivererPhone={!!deliverer?.phone}
                    metadata={{ model, _id }}
                  />
                </div>
              </>
            )}
          {messages.length === 0 && (
            <div className="text-center pb-3 pt-6 text-gray-500">
              <i className="fas fa-comments text-3xl"></i>
              <div>{tl("no_messages")}</div>
            </div>
          )}
          <div className="grid grid-cols-12 gap-y-2">
            {messages.map((message) => (
              <MessageComponent
                authRole={role}
                key={message._id}
                document_id={_id}
                {...message}
                model={model}
                showToast={showToast}
                isInternal={message.internal}
              />
            ))}
          </div>
          {(role === "client" || role === "followup") && (
            <SupportCategorySelector
              supportCategories={supportCategories}
              onValueChange={setText}
              handleSupportCategorySend={handleSupportCategorySend}></SupportCategorySelector>
          )}
        </div>
      </div>

      <div
        style={{ height: "33%" }}
        className="flex flex-col h-full md:flex-row items-center justify-center h-16 bg-white w-full px-6 md:px-6 py-2 gap-y-4 md:gap-x-4">
        <RatingComponent
          type={"support"}
          _id={_id}
          model={model}
          rating={rating?.support}
          disabled={disableRating}></RatingComponent>
        {model === "orders" && (
          <RatingComponent
            type={"order"}
            _id={_id}
            model={model}
            rating={rating?.order}
            disabled={disableRating}></RatingComponent>
        )}
        {model === "pickups" && (
          <RatingComponent
            type={"pickup"}
            _id={_id}
            model={model}
            rating={rating?.pickup}
            disabled={disableRating}></RatingComponent>
        )}
      </div>

      {contentType === "text" && (
        <Fragment>
          {role === "followup" && <SavedTexts onSelect={setText} disabled={disabled} />}
          <Container>
            <MessageStatusMenu _id={_id} model={model} status={status} role={role} />
            <div className="grow">
              <div className="relative w-full">
                <Input
                  autoFocus={!isFullScreen} // mobile
                  placeholder="Aa"
                  value={text}
                  onValueChange={setText}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(e)}
                  disabled={disabled}
                />
              </div>
            </div>

            {role === "followup" && (
              <div
                className={cl(
                  "w-12 h-12 flex items-center justify-center rounded-full px-4 py-1 shrink-0",
                  { "bg-gray-100 text-gray-700": !isInternal },
                  { "bg-yellow-100 text-yellow-700": isInternal },
                  { "hover:shadow-md cursor-pointer": !disabled },
                  { "pointer-events-none opacity-70": disabled }
                )}
                onClick={() => setIsInternal(!isInternal)}
                title={isInternal ? "Internal message" : "Public message"}>
                {isInternal ? (
                  <i className="fas fa-lock"></i>
                ) : (
                  <i className="fas fa-unlock"></i>
                )}
              </div>
            )}

            <SendButton />

            <AttachmentButton onSelect={setContentType} disabled={disabled} />

            {(role === "followup" || role === "warehouse") && <MarkDoneBtn />}
          </Container>
        </Fragment>
      )}
      {contentType === "image" && (
        <Fragment>
          <Container>
            <div className="grow">
              <FileInput
                file={localImage}
                setFile={setLocalImage}
                accept=".png, .jpg, .jpeg"
                disabled={disabled}
              />
            </div>
            <div className={cl({ "pointer-events-none opacity-70": !localImage })}>
              <SendButton />
            </div>
            <BackToTextBtn />
            {(role === "followup" || role === "warehouse") && <MarkDoneBtn />}
          </Container>
        </Fragment>
      )}
      {contentType === "audio" && (
        <Fragment>
          <Container>
            <div className="grow">
              {/* <FileInput file={localImage} setFile={setLocalImage} accept=".png, .jpg, .jpeg" /> */}
              <AudioRecord audio={localAudio} setAudio={setLocalAudio} disabled={disabled} />
            </div>
            <div className={cl({ "pointer-events-none opacity-70": !localAudio })}>
              <SendButton />
            </div>
            <BackToTextBtn />
            {(role === "followup" || role === "warehouse") && <MarkDoneBtn />}
          </Container>
        </Fragment>
      )}
    </div>
  );
};

function MessageComponent({
  document_id,
  _id,
  model,
  authRole,
  text,
  media,
  timestamps,
  user,
  thumbs,
  showToast,
  isInternal,
}) {
  const confirmAction = useConfirmation();
  const [isDeleting, setDeleting] = useState(false);

  // Don't show internal messages to clients
  if (authRole === "client" && isInternal) {
    return null;
  }

  async function deleteMessage(e) {
    e.preventDefault();
    if (isDeleting) return;
    setDeleting(true);
    const { error } = await xFetch(`/${model}/${document_id}/messages/${_id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (error) {
      return showToast(error, "error");
    }
    return showToast("success", "success");
  }

  const detectURLs = (messageText) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return messageText.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  if (user.role === "client") {
    return (
      <div className="col-start-1 sm:col-start-6 col-end-13 p-3 rounded-lg">
        <div className="flex items-center justify-start flex-row-reverse">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white shrink-0">
            <Pic jdenticonValue={user._id} className="border-[2px] rounded-full shadow-md" />
            {/* <img
              alt="Brand"
              className="w-full h-full rounded-full align-middle border-none shadow-lg hover:shadow-xl transition duration-300"
              src={imgSrc(user.client?.brand.image) || "/img/bot.png"}
            /> */}
          </div>
          <div
            className={cl(
              "relative mr-3 text-sm bg-green-100 shadow rounded-xl",
              { "py-2 px-4": media?.kind !== "image" },
              { "p-1": media?.kind === "image" }
            )}>
            <div>
              {media?.kind === "image" ? (
                <Image
                  className="rounded-xl overflow-hidden block"
                  public_id={media.link}
                  preview_transformations="w_200"
                />
              ) : media?.kind === "audio" ? (
                <Audio className="client" public_id={media.link} />
              ) : (
                detectURLs(text)
              )}
            </div>
            <div className="absolute text-xs bottom-0 right-0 -mb-5 mr-2 text-gray-500 whitespace-nowrap">
              {authRole === "followup" && (
                <i
                  className={`fas ${isDeleting
                    ? "fa-spinner animate-spin pointer-events-none"
                    : "fa-trash cursor-pointer"
                    } text-red-300 hover:text-red-500 mx-1 `}
                  onClick={(e) => {
                    confirmAction({
                      title: "Supprimer le message?",
                      onConfirm: () => deleteMessage(e),
                    });
                  }}
                  disabled={isDeleting}></i>
              )}
              <HumanDate date={getMostRecentTimestamp(timestamps)} /> ·
              <span className="font-bold ml-1">{user.name}</span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="col-start-1 col-end-12 sm:col-end-8 p-3 rounded-lg">
        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white shrink-0">
            <Pic jdenticonValue={user._id} className="border-[2px] shadow-md" />
          </div>
          <div
            className={cl(
              "relative ml-3 text-sm shadow rounded-xl",
              { "bg-white": !isInternal },
              { "bg-yellow-100": isInternal },
              { "py-2 px-4": !media },
              { "p-1": !!media }
            )}>
            {isInternal && (
              <div className="absolute -top-2 -left-2 text-yellow-500">
                <i className="fas fa-lock"></i>
              </div>
            )}
            <div>
              {media?.kind === "image" ? (
                <Image
                  className="rounded-xl overflow-hidden block"
                  public_id={media.link}
                  preview_transformations="w_200"
                />
              ) : media?.kind === "audio" ? (
                <Audio className="agent" public_id={media.link} />
              ) : (
                detectURLs(text)
              )}
            </div>
            <div className="absolute text-xs bottom-0 left-0 -mb-5 ml-2 text-gray-500 whitespace-nowrap">
              <span className="font-bold mr-1 capitalize">{user.role}</span>{" "}
              <span className="opacity-50">({user.name})</span> ·{" "}
              <HumanDate date={getMostRecentTimestamp(timestamps)} />
              {authRole === "followup" && (
                <i
                  className={`fas ${isDeleting
                    ? "fa-spinner animate-spin pointer-events-none"
                    : "fa-trash cursor-pointer"
                    } text-red-300 hover:text-red-500 mx-1 `}
                  onClick={(e) => {
                    confirmAction({
                      title: "Supprimer le message?",
                      onConfirm: () => deleteMessage(e),
                    });
                  }}
                  disabled={isDeleting}></i>
              )}
            </div>
          </div>
          <ThumbsUpDown
            model={model}
            authRole={authRole}
            document_id={document_id}
            messageId={_id}
            existingThumbsSelection={thumbs}
          />
        </div>
      </div>
    );
  }
}

function Container({ children }) {
  return (
    <div
      className="flex flex-row items-center h-16 bg-white w-full px-6 py-12 gap-x-4"
      style={{
        boxShadow:
          "0px 0px 30px rgba(16, 185, 129, 0.1), inset 0 -10px 15px 0 rgba(16, 185, 129, 0.2)",
      }}>
      {children}
    </div>
  );
}
