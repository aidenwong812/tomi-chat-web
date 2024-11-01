import { HeaderDropdown } from "../component-library/components/HeaderDropdown/HeaderDropdown";
import { useXmtpStore } from "../store/xmtp";

interface HeaderDropdownControllerProps {
  selectedSideNav: string;
  setSelectedSideNav: React.Dispatch<React.SetStateAction<string>>;
}

export const HeaderDropdownController = ({
  selectedSideNav,
  setSelectedSideNav,
}: HeaderDropdownControllerProps) => {
  const resetRecipient = useXmtpStore((s) => s.resetRecipient);
  const setConversationTopic = useXmtpStore((s) => s.setConversationTopic);
  const recipientInput = useXmtpStore((s) => s.recipientInput);
  const setStartedFirstMessage = useXmtpStore((s) => s.setStartedFirstMessage);

  return (
    <HeaderDropdown
      recipientInput={recipientInput}
      selectedSideNav={selectedSideNav}
      setSelectedSideNav={setSelectedSideNav}
      onClick={() => {
        resetRecipient();
        setConversationTopic();
        setStartedFirstMessage(true);
      }}
    />
  );
};
