import { useState, useEffect } from "react";
import type { CachedMessageWithId } from "@xmtp/react-sdk";
import { getMessageByXmtpID, useDb } from "@xmtp/react-sdk";
import { useWalletClient } from "wagmi";
import Blockies from "react-blockies";
import { useTranslation } from "react-i18next";
import { conversationsService } from "../../services/conversations";
import { classNames } from "../helpers";

interface MessageContent {
  content: string;
  senderAddress: string;
  sentAt: Date;
}

const GroupConversationController = ({ groupId }: { groupId: string }) => {
  const { t } = useTranslation();
  const db = useDb();
  const { data: walletClient } = useWalletClient();
  const [groupMessages, setGroupMessages] = useState<
    CachedMessageWithId<MessageContent>[]
  >([]);
  const [loading, setLoading] = useState(false);

  const incomingMessageBackgroundStyles =
    "rounded-[0px_20px_20px_20px] bg-[#FF0083] bg-opacity-20 dark:bg-opacity-50 text-black dark:text-white";
  const outgoingMessageBackgroundStyles =
    "rounded-[20px_20px_0_20px] bg-white dark:bg-[#111111] text-gray-900 dark:text-white border border-[#111111] border-opacity-50 dark:border-[#FF0083] dark:border-opacity-100";

  useEffect(() => {
    const getGroupConversations = async () => {
      setGroupMessages([]);
      setLoading(true);
      try {
        const conversationIds =
          await conversationsService.getConversation(groupId);
        const messagePromises = conversationIds.map((id) =>
          getMessageByXmtpID(id.message_id, db.db),
        );

        const fetchedMessages = (await Promise.all(messagePromises)).filter(
          (msg): msg is CachedMessageWithId<MessageContent> =>
            msg !== undefined,
        );
        setGroupMessages(fetchedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };

    void getGroupConversations();
  }, [groupId, db.db]);

  return (
    <div className="text-center px-4">
      {loading && <div>Loading messages...</div>}
      {groupMessages.length === 0 && !loading && (
        <div className="p-2">No message</div>
      )}
      {groupMessages.map((msg) => (
        <div
          key={msg.id}
          className={`flex w-full items-center ${
            msg.senderAddress === walletClient?.account.address
              ? "justify-end"
              : "justify-start"
          }`}>
          <div>
            {msg.senderAddress !== walletClient?.account.address && (
              <Blockies
                data-testid="avatar"
                seed={msg.senderAddress?.toLowerCase() || ""}
                scale={5}
                size={8}
                className="rounded-full"
              />
            )}
          </div>
          <div
            className={classNames(
              "p-2 m-2",
              msg.senderAddress === walletClient?.account.address
                ? outgoingMessageBackgroundStyles
                : incomingMessageBackgroundStyles,
            )}>
            <div className="text-black dark:text-white text-left">
              {msg.content.content}
            </div>
            {t("{{datetime, time}}", { datetime: msg.sentAt })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupConversationController;
