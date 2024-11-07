import { useEffect, useMemo, useState } from "react";
import { useConsent, useDb } from "@xmtp/react-sdk";
import type { CachedConversation } from "@xmtp/react-sdk";
import { useWalletClient } from "wagmi";
import { IoMdPersonAdd } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useXmtpStore } from "../store/xmtp";
import useListConversations from "../hooks/useListConversations";
import { ConversationList } from "../component-library/components/ConversationList/ConversationList";
import { MessagePreviewCardController } from "./MessagePreviewCardController";
import useStreamAllMessages from "../hooks/useStreamAllMessages";
import { groupsService } from "../../services/groups";
import CreateButton from "../component-library/components/CreateButton/CreateButton";
import { updateConversationIdentities } from "../helpers/conversation";
import { shortId } from "../helpers";
import { conversationsService } from "../../services/conversations";
import CreateModal from "../component-library/components/CreateModal/CreateModal";
import SideNavModal from "../component-library/components/SIdeNavModal/SideNavModal";
import { Spinner } from "../component-library/components/Loaders/Spinner";

interface ChatRoom {
  group_id: string;
  users: string[];
}

type ConversationListControllerProps = {
  setStartedFirstMessage: (startedFirstMessage: boolean) => void;
  selectedRoom: string;
  setSelectedRoom: (value: string) => void;
  setSelectedRoomMembers: (value: string[]) => void;
};

export const ConversationListController = ({
  setStartedFirstMessage,
  selectedRoom,
  setSelectedRoom,
  setSelectedRoomMembers,
}: ConversationListControllerProps) => {
  const [activeConversations, setActiveConversations] = useState<
    CachedConversation[]
  >([]);

  const { data: walletClient } = useWalletClient();
  const selectedSideNav = useXmtpStore((s) => s.selectedSideNav);

  const { isLoaded, isLoading, conversations } = useListConversations();
  const { isAllowed, isDenied, consentState } = useConsent();

  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  const [users, setUsers] = useState<string[]>(
    [walletClient?.account.address].filter(Boolean) as string[],
  );

  const recipientAddress = useXmtpStore((s) => s.recipientAddress);

  const { db } = useDb();

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isCreateChatRoom, setIsCreateChatRoom] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useStreamAllMessages();
  const recipientInput = useXmtpStore((s) => s.recipientInput);
  const activeTab = useXmtpStore((s) => s.activeTab);

  // when the conversations are loaded, update their identities
  useEffect(() => {
    const runUpdate = async () => {
      if (isLoaded) {
        await updateConversationIdentities(activeConversations, db);
      }
    };
    void runUpdate();
  }, [activeConversations, db, isLoaded]);

  const fetchGroups = async () => {
    if (!walletClient?.account.address) return;
    setIsLoadingGroups(true);
    try {
      const rooms = await groupsService.getByUserId(
        walletClient.account.address,
      );
      setChatRooms(rooms as ChatRoom[]);
      setIsLoadingGroups(false);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  useEffect(() => {
    void fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateChatRoom, walletClient?.account.address]);

  useEffect(() => {
    const getActiveConversations = async () => {
      const active = await Promise.all(
        conversations.map(async (conversation) => {
          if (
            activeTab === "blocked" &&
            (await isDenied(conversation.peerAddress))
          ) {
            return conversation;
          }
          if (
            activeTab === "messages" &&
            (await isAllowed(conversation.peerAddress))
          ) {
            return conversation;
          }
          if (
            activeTab === "requests" &&
            (await consentState(conversation.peerAddress)) === "unknown"
          ) {
            return conversation;
          }
          return null;
        }),
      );
      setActiveConversations(active.filter(Boolean) as CachedConversation[]);
    };
    void getActiveConversations();
  }, [activeTab, consentState, conversations, isAllowed, isDenied]);

  const messagesToPass = useMemo(
    () =>
      activeConversations.map((conversation: CachedConversation) => (
        <MessagePreviewCardController
          key={conversation.topic}
          convo={conversation}
        />
      )),
    [activeConversations],
  );

  const handleRoomClick = (room: ChatRoom) => {
    setSelectedRoom(room.group_id);
    localStorage.setItem("groupId", room.group_id);
    setSelectedRoomMembers(room.users);
  };

  const handleDelete = async (groupId: string) => {
    setIsLoadingGroups(true);
    await groupsService.delete(groupId);
    await conversationsService.deleteConversation(groupId);
    void fetchGroups();
  };

  const handleAddUser = async (groupId: string) => {
    if (!recipientAddress) return;
    await groupsService.addMember(groupId, recipientAddress);
    void fetchGroups();
  };

  return selectedSideNav === "Chats" ? (
    <ConversationList
      hasRecipientEnteredValue={!!recipientInput}
      setStartedFirstMessage={() => setStartedFirstMessage(true)}
      isLoading={isLoading}
      messages={messagesToPass}
      activeTab={activeTab}
    />
  ) : selectedSideNav === "Rooms" ? (
    <div className="space-y-4 h-screen">
      <div className="flex gap-4 justify-between items-center pl-10 border-b border-[#a2a2a2] dark:border-[#141415] py-2">
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
          }}>
          <img
            src="/tomi.svg"
            alt="tomi"
            className="size-6 xl:hidden flex mt-4"
          />
        </button>
        {isModalOpen && <SideNavModal setIsModalOpen={setIsModalOpen} />}
        <h2 className="text-4xl mt-4 font-bold text-center">Rooms</h2>
        <CreateButton
          isCreateChatRoom={isCreateChatRoom}
          setIsCreateChatRoom={setIsCreateChatRoom}
        />
      </div>
      {isCreateChatRoom && (
        <div>
          <CreateModal
            activeConversations={activeConversations}
            isCreateChatRoom={isCreateChatRoom}
            setIsCreateChatRoom={setIsCreateChatRoom}
            users={users}
            setUsers={setUsers}
          />
        </div>
      )}
      <div className="flex flex-col gap-4 mx-4">
        {isLoadingGroups ? (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          chatRooms.map((room: ChatRoom) => (
            <button
              key={room.group_id}
              className={` flex items-center justify-between text-left p-4 w-full rounded-xl border border-[#FF0083] dark:border-[#000000]  ${
                selectedRoom === room.group_id
                  ? "text-white bg-[#FF0083] opacity-70 "
                  : "hover:bg-secondary dark:bg-[#141414]"
              }`}
              onClick={() => handleRoomClick(room)}
              type="button">
              <div>
                <span>Room ID: {shortId(room.group_id)}</span>
                <span className="block">Members: {room.users.length}</span>
              </div>
              <div className="flex gap-4">
                <IoMdPersonAdd
                  size={24}
                  onClick={() => {
                    void handleAddUser(room.group_id);
                  }}
                />
                <RiDeleteBin6Line
                  size={24}
                  onClick={() => {
                    void handleDelete(room.group_id);
                  }}
                />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  ) : null;
};
