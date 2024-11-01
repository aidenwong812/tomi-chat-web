import { useEffect, useMemo, useState } from "react";
import { useConsent, useDb } from "@xmtp/react-sdk";
import type { CachedConversation } from "@xmtp/react-sdk";
import { useWalletClient } from "wagmi";
import { useXmtpStore } from "../store/xmtp";
import useListConversations from "../hooks/useListConversations";
import { ConversationList } from "../component-library/components/ConversationList/ConversationList";
import { MessagePreviewCardController } from "./MessagePreviewCardController";
import useStreamAllMessages from "../hooks/useStreamAllMessages";
import { groupsService } from "../../services/groups";
import CreateButton from "../component-library/components/CreateButton/CreateButton";
import { updateConversationIdentities } from "../helpers/conversation";

interface ChatRoom {
  group_id: string;
  users: string[];
}

type ConversationListControllerProps = {
  setStartedFirstMessage: (startedFirstMessage: boolean) => void;
  selectedRoom: string;
  setSelectedRoom: (value: string) => void;
  setSelectedRoomMembers: (value: string[]) => void;
  selectedSideNav: string;
};

export const ConversationListController = ({
  setStartedFirstMessage,
  selectedRoom,
  setSelectedRoom,
  setSelectedRoomMembers,
  selectedSideNav,
}: ConversationListControllerProps) => {
  const [activeConversations, setActiveConversations] = useState<
    CachedConversation[]
  >([]);

  const { data: walletClient } = useWalletClient();

  const [users, setUsers] = useState<string[]>(
    [walletClient?.account.address].filter(Boolean) as string[],
  );

  const { isLoaded, isLoading, conversations } = useListConversations();
  const { isAllowed, isDenied, consentState } = useConsent();

  const recipientAddress = useXmtpStore((s) => s.recipientAddress);

  const { db } = useDb();

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isCreateChatRoom, setIsCreateChatRoom] = useState(false);

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

  useEffect(() => {
    const fetchGroups = async () => {
      if (!walletClient?.account.address) return;
      try {
        const rooms = await groupsService.getByUserId(
          walletClient.account.address,
        );
        setChatRooms(rooms as ChatRoom[]);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };

    void fetchGroups();
  }, [isCreateChatRoom, walletClient?.account.address]);

  useEffect(() => {
    if (isCreateChatRoom && recipientAddress) {
      const updatedUsers = users.includes(recipientAddress)
        ? users.filter((user) => user !== recipientAddress)
        : [...users, recipientAddress];
      setUsers(updatedUsers);
    }
  }, [isCreateChatRoom, recipientAddress, users]);

  useEffect(() => {
    const createGroup = async () => {
      if (!isCreateChatRoom && users.length > 2) {
        const newGroupId = Math.random().toString(36).substring(2, 15);
        try {
          await groupsService.create({
            group_id: newGroupId,
            users,
          });
          setUsers([walletClient?.account.address ?? ""]);
        } catch (error) {
          console.error("Failed to create group:", error);
        }
      }
    };

    void createGroup();
  }, [isCreateChatRoom, users, walletClient?.account.address]);

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

  return selectedSideNav !== "Rooms" ? (
    <ConversationList
      hasRecipientEnteredValue={!!recipientInput}
      setStartedFirstMessage={() => setStartedFirstMessage(true)}
      isLoading={isLoading}
      messages={messagesToPass}
      activeTab={activeTab}
    />
  ) : (
    <div className="space-y-4 h-screen">
      <h2 className="text-2xl mt-4 font-bold text-center">Rooms</h2>
      <CreateButton
        isCreateChatRoom={isCreateChatRoom}
        setIsCreateChatRoom={setIsCreateChatRoom}
      />
      {isCreateChatRoom ? (
        <div className="h-full">
          {activeConversations.map((conversation: CachedConversation) => (
            <MessagePreviewCardController
              key={conversation.topic}
              convo={conversation}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mx-4">
          {chatRooms.map((room: ChatRoom) => (
            <button
              key={room.group_id}
              className={` tex-left p-4 w-full rounded-xl border border-[#FF0083] dark:border-[#000000]  ${
                selectedRoom === room.group_id
                  ? "text-white bg-[#FF0083] opacity-70 "
                  : "hover:bg-secondary dark:bg-[#141414]"
              }`}
              onClick={() => handleRoomClick(room)}
              type="button">
              <span>Room ID: {room.group_id}</span>
              <span className="block">Members: {room.users.length}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
