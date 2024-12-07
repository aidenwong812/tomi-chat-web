import { create } from "zustand";
import type { CachedMessageWithId } from "@xmtp/react-sdk";
import type { ETHAddress } from "../helpers";

export type RecipientState = "invalid" | "loading" | "error" | "valid";

export type ActiveTab = "messages" | "requests" | "blocked";

export type RecipientAddress = ETHAddress | null;

interface XmtpState {
  loadingConversations: boolean;
  setLoadingConversations: (loadingConversations: boolean) => void;
  selectedSideNav: string;
  setSelectedSideNav: (selectedSideNav: string) => void;
  clientName: string | null;
  setClientName: (name: string | null) => void;
  clientAvatar: string | null;
  setClientAvatar: (avatar: string | null) => void;
  recipientInput: string;
  setRecipientInput: (input: string) => void;
  recipientAddress: RecipientAddress;
  setRecipientAddress: (address: RecipientAddress) => void;
  recipientName: string | null;
  setRecipientName: (address: string | null) => void;
  recipientAvatar: string | null;
  setRecipientAvatar: (avatar: string | null) => void;
  recipientState: RecipientState;
  setRecipientState: (state: RecipientState) => void;
  recipientOnNetwork: boolean;
  setRecipientOnNetwork: (onNetwork: boolean) => void;
  conversationTopic?: string;
  setConversationTopic: (conversationTopic?: string) => void;
  resetXmtpState: () => void;
  resetRecipient: () => void;
  startedFirstMessage: boolean;
  setStartedFirstMessage: (startedFirstMessage: boolean) => void;
  attachmentError: string;
  setAttachmentError: (attachmentError: string) => void;
  activeMessage?: CachedMessageWithId;
  setActiveMessage: (message?: CachedMessageWithId) => void;
  activeTab: ActiveTab;
  setActiveTab: (activeTab: ActiveTab) => void;
  isGroupChatUpdate: boolean;
  setIsGroupChatUpdate: (isGroupChatUpdate: boolean) => void;
  selectedRoom: string;
  setSelectedRoom: (selectedRoom: string) => void;
  selectedRoomMembers: string[];
  setSelectedRoomMembers: (selectedRoomMembers: string[]) => void;
  chatRooms:
    | {
        group_id: string;
        users: string[];
      }[]
    | null;
  setChatRooms: (
    chatRooms:
      | {
          group_id: string;
          users: string[];
        }[]
      | null,
  ) => void;
  changedConsentCount: number;
  setChangedConsentCount: (changedConsentCount: number) => void;
}

export const useXmtpStore = create<XmtpState>((set) => ({
  loadingConversations: true,
  setLoadingConversations: (loadingConversations: boolean) =>
    set(() => ({ loadingConversations })),
  isGroupChatUpdate: true,
  setIsGroupChatUpdate: (isGroupChatUpdate: boolean) =>
    set(() => ({ isGroupChatUpdate })),
  selectedRoomMembers: [],
  setSelectedRoomMembers: (selectedRoomMembers) =>
    set(() => ({ selectedRoomMembers })),
  selectedSideNav: "Chats",
  setSelectedSideNav: (selectedSideNav: string) =>
    set(() => ({ selectedSideNav })),
  clientName: null,
  setClientName: (name) => set(() => ({ clientName: name })),
  selectedRoom: "",
  setSelectedRoom: (selectedRoom) => set(() => ({ selectedRoom })),
  clientAvatar: null,
  setClientAvatar: (avatar) => set(() => ({ clientAvatar: avatar })),
  recipientInput: "",
  setRecipientInput: (input) => set(() => ({ recipientInput: input })),
  recipientAddress: null,
  setRecipientAddress: (address) => set(() => ({ recipientAddress: address })),
  recipientName: null,
  setRecipientName: (name) => set(() => ({ recipientName: name })),
  recipientAvatar: null,
  setRecipientAvatar: (avatar) => set(() => ({ recipientAvatar: avatar })),
  recipientState: "invalid",
  setRecipientState: (state) => set(() => ({ recipientState: state })),
  recipientOnNetwork: false,
  setRecipientOnNetwork: (onNetwork) =>
    set(() => ({ recipientOnNetwork: onNetwork })),
  conversationTopic: "",
  setConversationTopic: (conversationTopic) =>
    set(() => ({ conversationTopic })),
  chatRooms: null,
  setChatRooms: (chatRooms) => set(() => ({ chatRooms })),
  resetXmtpState: () =>
    set(() => ({
      client: undefined,
      selectedSideNav: "",
      recipientInput: "",
      recipientAddress: null,
      recipientName: null,
      recipientAvatar: null,
      recipientState: "invalid",
      conversationTopic: undefined,
      startedFirstMessage: false,
    })),
  resetRecipient: () =>
    set(() => ({
      recipientInput: "",
      recipientAddress: null,
      recipientName: null,
      recipientAvatar: null,
      recipientState: "invalid",
    })),
  startedFirstMessage: false,
  setStartedFirstMessage: (startedFirstMessage) =>
    set(() => ({ startedFirstMessage })),
  attachmentError: "",
  setAttachmentError: (attachmentError) => set(() => ({ attachmentError })),
  activeMessage: undefined,
  setActiveMessage: (activeMessage) => set(() => ({ activeMessage })),
  activeTab: "messages",
  setActiveTab: (activeTab) => set(() => ({ activeTab })),
  changedConsentCount: 0,
  setChangedConsentCount: (changedConsentCount) =>
    set(() => ({ changedConsentCount })),
}));
