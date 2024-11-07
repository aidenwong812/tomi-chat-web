import { useTranslation } from "react-i18next";
import { useState } from "react";
import { classNames } from "../../../helpers";
import { IconButton } from "../IconButton/IconButton";
import type { ActiveTab } from "../../../store/xmtp";
import { useXmtpStore } from "../../../store/xmtp";
import SideNavModal from "../SIdeNavModal/SideNavModal";

// To-do: rename this throughout the app, as this is no longer a dropdown
interface HeaderDropdownProps {
  /**
   * On new message button click?
   */
  onClick?: () => void;
  /**
   * What is the recipient input?
   */
  recipientInput: string;
}

export const HeaderDropdown = ({
  onClick,
  recipientInput,
}: HeaderDropdownProps) => {
  const { t } = useTranslation();

  const activeTab = useXmtpStore((s) => s.activeTab);
  const setActiveTab = useXmtpStore((s) => s.setActiveTab);
  const resetRecipient = useXmtpStore((s) => s.resetRecipient);
  const setConversationTopic = useXmtpStore((s) => s.setConversationTopic);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs: {
    name: ActiveTab;
    testId: string;
  }[] = [
    { name: "messages", testId: "messages-button" },
    { name: "requests", testId: "requests-button" },
    { name: "blocked", testId: "blocked-button" },
  ];

  return (
    <div
      data-modal-target="headerModalId"
      data-testid="conversation-list-header"
      className="border-b border-[#a2a2a2] dark:border-[#141415] bg-transparent h-16 p-4 pt-5 ">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
          }}>
          <img src="/tomi.svg" alt="tomi" className="size-6 xl:hidden flex" />
        </button>
        {isModalOpen && <SideNavModal setIsModalOpen={setIsModalOpen} />}
        {tabs.map(({ name, testId }) => (
          <button
            key={name}
            data-testid={testId}
            type="button"
            className={classNames(
              "text-lg mr-2 cursor-pointer text-[#FF0083]",
              activeTab === name ? "font-bold" : "",
            )}
            onClick={() => {
              setActiveTab(name);
              resetRecipient();
              setConversationTopic();
            }}>
            {t(`consent.${name}`)}
          </button>
        ))}
        {recipientInput && (
          <IconButton
            onClick={() => onClick?.()}
            // label={<PlusIcon color="white" width="20" />}
            testId="new-message-icon-cta"
            srText={t("aria_labels.start_new_message") || ""}
          />
        )}
      </div>
    </div>
  );
};
