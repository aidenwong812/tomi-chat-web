import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { StarIcon } from "@heroicons/react/solid";
import { IconSkeletonLoader } from "../Loaders/SkeletonLoaders/IconSkeletonLoader";
import { ShortCopySkeletonLoader } from "../Loaders/SkeletonLoaders/ShortCopySkeletonLoader";
import { classNames } from "../../../helpers";
import { Avatar } from "../Avatar/Avatar";
import type { ActiveTab } from "../../../store/xmtp";

interface MessagePreviewCardProps {
  /**
   * What is the avatar url?
   */
  avatarUrl?: string;
  /**
   * What is the message text?
   */
  text?: string | ReactElement;
  /**
   * What is the display address associated with the message?
   */
  displayAddress?: string;
  /**
   * What is the wallet address associated with the message?
   */
  address: string;
  /**
   * What is the datetime of the message
   */
  datetime?: Date;
  /**
   * Are we waiting on anything loading?
   */
  isLoading?: boolean;
  /**
   * What happens on message click?
   */
  onClick?: () => void;
  /**
   * Is conversation selected?
   */
  isSelected?: boolean;
  /**
   * What is the app this conversation started on?
   */
  conversationDomain?: string;
  /**
   * Is this conversation pinned?
   */
  pinned?: boolean;
  /**
   * Which tab are we on?
   */
  activeTab: ActiveTab;
  /**
   * Method to reset tab
   */
  setActiveTab: (tab: ActiveTab) => void;
  /**
   * Method to allow an address
   */
  allow: (address: string[]) => Promise<void>;
}

export const MessagePreviewCard = ({
  avatarUrl,
  text,
  displayAddress,
  address,
  datetime,
  isLoading = false,
  onClick,
  isSelected,
  conversationDomain,
  pinned,
  activeTab,
  setActiveTab,
  allow,
}: MessagePreviewCardProps) => {
  const { t } = useTranslation();

  return (
    <div
      role="button"
      className={classNames(
        "flex items-center p-3 mb-2 rounded-3xl cursor-pointer mx-4",
        isSelected
          ? "bg-pink-700 text-white hover:bg-pink-600"
          : "bg-white dark:bg-[#111111] hover:bg-pink-100 dark:hover:bg-gray-700 border border-[#FF0083] dark:border-black",
        isLoading ? "px-4 py-2" : "p-4",
      )}
      onClick={onClick}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onClick?.();
        }
      }}
      tabIndex={0}>
      <Avatar url={avatarUrl} address={address} isLoading={isLoading} />
      <div
        className={classNames(
          "flex flex-col items-start w-3/4 ml-3",
          !isLoading ? "overflow-hidden" : "",
        )}>
        {!isLoading && conversationDomain && (
          <div
            className={`text-sm truncate ${isSelected ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
            {conversationDomain}
          </div>
        )}
        {isLoading ? (
          <ShortCopySkeletonLoader />
        ) : (
          <span
            className={`text-sm mt-1 truncate ${isSelected ? "text-white" : "text-gray-500 dark:text-gray-400"}`}>
            {displayAddress ?? t("messages.convos_empty_recipient_placeholder")}
          </span>
        )}
        {isLoading ? (
          <ShortCopySkeletonLoader />
        ) : (
          <span
            className={`text-sm mt-1 truncate ${isSelected ? "text-white" : "text-gray-500 dark:text-gray-400"}`}
            data-testid="message-preview-text">
            {text}
          </span>
        )}
      </div>
      {isLoading ? (
        <IconSkeletonLoader />
      ) : (
        <div
          className={classNames(
            "text-xs",
            isSelected ? "text-white" : "text-[#a2a2a2]",
            "w-1/3",
            "text-right",
            "ml-4",
            "h-full",
            "flex flex-col items-end justify-between",
          )}>
          {activeTab === "blocked" ? (
            <button
              type="button"
              className=" font-bold text-md"
              onClick={() => {
                void allow([address]);
                setActiveTab("messages");
              }}>
              {t("consent.unblock")}
            </button>
          ) : (
            datetime && t("{{datetime, ago}}", { datetime })
          )}
          {pinned && (
            <div>
              <StarIcon className="text-indigo-600 mt-2" width={16} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
