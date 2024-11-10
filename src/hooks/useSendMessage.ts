import { useCallback } from "react";
import type { CachedConversation, CachedMessageWithId } from "@xmtp/react-sdk";
import {
  ContentTypeText,
  useSendMessage as _useSendMessage,
} from "@xmtp/react-sdk";
import type {
  Attachment,
  RemoteAttachment,
} from "@xmtp/content-type-remote-attachment";
import {
  ContentTypeRemoteAttachment,
  RemoteAttachmentCodec,
  AttachmentCodec,
} from "@xmtp/content-type-remote-attachment";
import { ContentTypeReply } from "@xmtp/content-type-reply";
import type { Reply } from "@xmtp/content-type-reply";
import * as Client from "@web3-storage/w3up-client";
import * as Signer from "@ucanto/principal/ed25519";
import Upload from "../helpers/classes/Upload";
import { useXmtpStore } from "../store/xmtp";
import { parseProof } from "../helpers/attachments";

const useSendMessage = (
  attachment?: Attachment,
  activeMessage?: CachedMessageWithId | undefined,
) => {
  const { sendMessage: _sendMessage, isLoading, error } = _useSendMessage();
  const recipientOnNetwork = useXmtpStore((s) => s.recipientOnNetwork);
  const selectedSideNav = useXmtpStore((s) => s.selectedSideNav);

  const sendMessage = useCallback(
    async (
      conversation: CachedConversation,
      message: string | Attachment,
      type: "text" | "attachment",
    ) => {
      if (!recipientOnNetwork && selectedSideNav !== "Rooms") {
        return;
      }
      if (attachment && type === "attachment") {
        const principal = Signer.parse(import.meta.env.VITE_KEY);
        const client = await Client.create({ principal });

        const proof = await parseProof(import.meta.env.VITE_PROOF);
        const space = await client.addSpace(proof);

        await client.setCurrentSpace(space.did());
        // const client = await Client.create();

        const encryptedEncoded = await RemoteAttachmentCodec.encodeEncrypted(
          attachment,
          new AttachmentCodec(),
        );

        const upload = new Upload(
          "XMTPEncryptedContent",
          encryptedEncoded.payload,
        );

        const cid = await client.uploadFile(upload);
        const cidToString = cid.toString();

        const url = `https://w3s.link/ipfs/${cidToString}`;
        const remoteAttachment: RemoteAttachment = {
          url,
          contentDigest: encryptedEncoded.digest,
          salt: encryptedEncoded.salt,
          nonce: encryptedEncoded.nonce,
          secret: encryptedEncoded.secret,
          scheme: "https://",
          filename: attachment.filename,
          contentLength: attachment.data.byteLength,
        };

        if (activeMessage?.xmtpID) {
          void _sendMessage(
            conversation,
            {
              reference: activeMessage.xmtpID,
              content: remoteAttachment,
              contentType: ContentTypeRemoteAttachment,
            } satisfies Reply,
            ContentTypeReply,
          );
        } else {
          void _sendMessage(
            conversation,
            remoteAttachment,
            ContentTypeRemoteAttachment,
          );
        }
      } else if (type === "text") {
        if (activeMessage?.xmtpID) {
          const messageId = await _sendMessage(
            conversation,
            {
              reference: activeMessage.xmtpID,
              content: message,
              contentType: ContentTypeText,
            } satisfies Reply,
            ContentTypeReply,
          );
          if (messageId) localStorage.setItem("messageId", messageId.id);
        } else {
          const messageId = await _sendMessage(conversation, message);
          if (messageId) localStorage.setItem("messageId", messageId.id);
        }
      }
    },
    [
      recipientOnNetwork,
      attachment,
      _sendMessage,
      activeMessage,
      selectedSideNav,
    ],
  );

  return {
    sendMessage,
    loading: isLoading,
    error,
  };
};

export default useSendMessage;
