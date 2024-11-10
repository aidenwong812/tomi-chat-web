import type React from "react";
import { useEffect, useState } from "react";
import {
  useConsent,
  useClient,
  useConversations,
  useStreamConversations,
} from "@xmtp/react-sdk";
import { useDisconnect, useWalletClient } from "wagmi";
import type { Attachment } from "@xmtp/content-type-remote-attachment";
import { useNavigate } from "react-router-dom";
import { XIcon } from "@heroicons/react/outline";
import { FiArrowLeft } from "react-icons/fi";
import { useXmtpStore } from "../store/xmtp";
import { wipeKeys } from "../helpers";
import { FullConversationController } from "../controllers/FullConversationController";
import { AddressInputController } from "../controllers/AddressInputController";
import { HeaderDropdownController } from "../controllers/HeaderDropdownController";
import { MessageInputController } from "../controllers/MessageInputController";
import { SideNavController } from "../controllers/SideNavController";
import { ConversationListController } from "../controllers/ConversationListController";
import { useAttachmentChange } from "../hooks/useAttachmentChange";
import useSelectedConversation from "../hooks/useSelectedConversation";
import { ReplyThread } from "../component-library/components/ReplyThread/ReplyThread";
import GroupConversationController from "../controllers/GroupConversationController";

const Inbox: React.FC<{ children?: React.ReactNode }> = () => {
  const navigate = useNavigate();
  const resetXmtpState = useXmtpStore((state) => state.resetXmtpState);
  const activeMessage = useXmtpStore((state) => state.activeMessage);

  const { client, disconnect } = useClient();
  const [isDragActive, setIsDragActive] = useState(true);
  const { conversations } = useConversations();
  const selectedConversation = useSelectedConversation();
  const { data: walletClient } = useWalletClient();
  useStreamConversations();

  const { loadConsentList } = useConsent();

  useEffect(() => {
    if (!client) {
      navigate("/");
    } else {
      // make sure there's a client before loading the consent list
      void loadConsentList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const activeTab = useXmtpStore((s) => s.activeTab);
  const setActiveMessage = useXmtpStore((s) => s.setActiveMessage);

  // const size = useWindowSize();

  const loadingConversations = useXmtpStore(
    (state) => state.loadingConversations,
  );
  const startedFirstMessage = useXmtpStore(
    (state) => state.startedFirstMessage,
  );
  const setStartedFirstMessage = useXmtpStore(
    (state) => state.setStartedFirstMessage,
  );
  const selectedRoom = useXmtpStore((state) => state.selectedRoom);
  const selectedRoomMembers = useXmtpStore(
    (state) => state.selectedRoomMembers,
  );

  const { disconnect: disconnectWagmi, reset: resetWagmi } = useDisconnect();
  const [isConversationListOpen, setIsConversationListOpen] = useState(false);
  const [attachmentPreview, setAttachmentPreview]: [
    string | undefined,
    (url: string | undefined) => void,
  ] = useState();

  const [attachment, setAttachment]: [
    Attachment | undefined,
    (attachment: Attachment | undefined) => void,
  ] = useState();

  const selectedSideNav = useXmtpStore((s) => s.selectedSideNav);

  const { onAttachmentChange } = useAttachmentChange({
    setAttachment,
    setAttachmentPreview,
    setIsDragActive,
  });

  useEffect(() => {
    setIsConversationListOpen(false);
  }, [selectedConversation]);

  // if the wallet address changes, disconnect the XMTP client
  useEffect(() => {
    const checkSigners = () => {
      const address1 = walletClient?.account.address;
      const address2 = client?.address;
      // addresses must be defined before comparing
      if (address1 && address2 && address1 !== address2) {
        resetXmtpState();
        void disconnect();
        wipeKeys(address1 ?? "");
        disconnectWagmi();
        resetWagmi();
      }
    };
    checkSigners();
  }, [
    disconnect,
    resetXmtpState,
    walletClient,
    client?.address,
    resetWagmi,
    disconnectWagmi,
  ]);

  if (!client) {
    return <div />;
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  return (
    // Controller for drag-and-drop area
    <div
      className={`bg-white dark:bg-black ${isDragActive ? "bg-slate-100" : "bg-white relative"}`}
      onDragOver={handleDrag}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDrop={onAttachmentChange}>
      <div className="w-[100%] md:h-full overflow-auto flex md:w-full">
        <div
          className={`${isConversationListOpen ? "flex" : "hidden"} md:flex flex-1 md:flex-[4]`}>
          <div className="xl:flex flex-[1] hidden w-[320px]">
            <SideNavController />
          </div>
          <div className="flex flex-[2] flex-col w-full h-screen overflow-y-auto md:min-w-[350px] bg-white dark:bg-black gap-4 border-x border-[#a2a2a2] dark:border-[#141415]">
            {selectedSideNav === "Chats" && <HeaderDropdownController />}
            <ConversationListController
              setStartedFirstMessage={setStartedFirstMessage}
            />
          </div>
        </div>
        {selectedSideNav === "Rooms" ? (
          <div
            className={`${!isConversationListOpen ? "flex" : "hidden"} flex-1 md:flex-[6] w-full flex-col h-screen overflow-hidden`}>
            <div className="flex justify-center font-bold text-xl border border-[#FF0083] p-4 rounded-b-3xl">
              {selectedRoom ? <h1>Chat Room Id: {selectedRoom}</h1> : null}
            </div>
            <div className="h-full overflow-auto flex flex-col">
              {selectedRoomMembers.length > 2 && (
                <GroupConversationController />
              )}
            </div>
            <button
              type="button"
              className="flex md:hidden"
              onClick={() => setIsConversationListOpen(true)}>
              <FiArrowLeft className="size-10 m-4 rounded-full p-2 dark:bg-[#141414] dark:border-black dark:text-white bg-white text-[#FF0083] border border-[#FF0083]" />
            </button>
            {activeTab === "messages" ? (
              <MessageInputController
                attachment={attachment}
                setAttachment={setAttachment}
                attachmentPreview={attachmentPreview}
                setAttachmentPreview={setAttachmentPreview}
                setIsDragActive={setIsDragActive}
              />
            ) : null}
          </div>
        ) : (
          <div
            className={`${!isConversationListOpen ? "flex" : "hidden"} flex-1 md:flex-[6] w-full flex-col h-screen overflow-hidden`}>
            {!conversations.length &&
            !loadingConversations &&
            !startedFirstMessage ? (
              <div />
            ) : (
              // Full container including replies
              <div className="flex h-screen">
                <div className="h-full w-full flex flex-col justify-between">
                  {activeMessage && selectedConversation ? (
                    <div className="h-full overflow-auto">
                      <XIcon
                        data-testid="replies-close-icon"
                        width={24}
                        onClick={() => setActiveMessage()}
                        className="absolute top-2 right-2 cursor-pointer"
                      />
                      <ReplyThread conversation={selectedConversation} />
                    </div>
                  ) : (
                    <>
                      <div className="flex" data-testid="address-container">
                        <AddressInputController />
                      </div>
                      <div
                        className="h-full overflow-auto flex flex-col"
                        onFocus={() => {
                          setActiveMessage();
                        }}>
                        {selectedConversation && (
                          <FullConversationController
                            conversation={selectedConversation}
                          />
                        )}
                      </div>
                    </>
                  )}
                  <button
                    type="button"
                    className="flex md:hidden"
                    onClick={() => setIsConversationListOpen(true)}>
                    <FiArrowLeft className="size-10 m-4 rounded-full p-2 dark:bg-[#141414] dark:border-black dark:text-white bg-white text-[#FF0083] border border-[#FF0083]" />
                  </button>
                  {activeTab === "messages" ? (
                    <MessageInputController
                      attachment={attachment}
                      setAttachment={setAttachment}
                      attachmentPreview={attachmentPreview}
                      setAttachmentPreview={setAttachmentPreview}
                      setIsDragActive={setIsDragActive}
                    />
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
