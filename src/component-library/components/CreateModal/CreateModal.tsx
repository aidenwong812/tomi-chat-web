import type { CachedConversation } from "@xmtp/react-sdk";
import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import Blockies from "react-blockies";
import { groupsService } from "../../../../services/groups";
import { shortAddress } from "../../../helpers";

interface CreateModalProps {
  activeConversations: CachedConversation[];
  users: string[];
  setUsers: (value: string[]) => void;
  isCreateChatRoom: boolean;
  setIsCreateChatRoom: (value: boolean) => void;
}

const CreateModal = ({
  activeConversations,
  users,
  setUsers,
  isCreateChatRoom,
  setIsCreateChatRoom,
}: CreateModalProps) => {
  const { data: walletClient } = useWalletClient();
  const [selectedUser, setSelectedUser] = useState<string>("");

  useEffect(() => {
    if (isCreateChatRoom && selectedUser) {
      const updatedUsers = users.includes(selectedUser)
        ? users.filter((user) => user !== selectedUser)
        : [...users, selectedUser];
      setUsers(updatedUsers);
    }
  }, [isCreateChatRoom, selectedUser, users, setUsers]);

  const handleComplete = () => {
    if (isCreateChatRoom && users.length > 2) {
      const newGroupId = Math.random().toString(36).substring(2, 15);
      groupsService
        .create({
          group_id: newGroupId,
          users,
        })
        .then(() => {
          setUsers([walletClient?.account.address ?? ""]);
        })
        .catch((error) => {
          console.error("Failed to create group:", error);
        });
    }
    setUsers([walletClient?.account.address ?? ""]);
    setIsCreateChatRoom(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div
        role="presentation"
        className="fixed bg-black insert-0 opacity-50 transition-opacity"
        onClick={() => setIsCreateChatRoom(false)}
        onKeyDown={() => setIsCreateChatRoom(false)}
      />
      <div className="flex flex-col gap-4 rounded-md p-4 w-[400px] h-[600px] overflow-y-auto   dark:bg-[#141414] bg-[#8b8888]">
        <p className="text-white">Select users to add to your group</p>
        {activeConversations.map((conversation: CachedConversation) => (
          <button
            type="button"
            key={conversation.topic}
            className={`bg-white dark:bg-[#141414] border border-[#FF0083] dark:border-[#000000] flex gap-4 items-center rounded-md p-2
          ${users.includes(conversation.peerAddress) ? "bg-[#FF0083] dark:bg-[#FF0083]" : ""}
          `}
            onClick={() => setSelectedUser(conversation.peerAddress)}>
            <Blockies
              seed={conversation.topic}
              scale={5}
              size={8}
              className="rounded-full"
            />
            <div>{shortAddress(conversation.peerAddress)}</div>
          </button>
        ))}
        <button
          type="button"
          onClick={handleComplete}
          className="bg-[#47285e] dark:bg-[#47285e] duration-200 hover:bg-[#FF0083] hover:dark:bg-[#FF0083] absolute bottom-4 hover:text-white
      hover:border-[#FF0083] hover:dark:border-[#FF0083] text-black w-[200px] left-[50%] translate-x-[-50%] dark:text-white p-2 rounded-md">
          Complete
        </button>
      </div>
    </div>
  );
};

export default CreateModal;
