import { useDisconnect } from "wagmi";
import { useClient } from "@xmtp/react-sdk";
import type { SetStateAction, Dispatch } from "react";
import SideNav from "../component-library/components/SideNav/SideNav";
import type { ETHAddress } from "../helpers";
import { wipeKeys } from "../helpers";
import { useXmtpStore } from "../store/xmtp";

export const SideNavController = ({
  selectedSideNav,
  setSelectedSideNav,
}: {
  selectedSideNav: string;
  setSelectedSideNav: Dispatch<SetStateAction<string>>;
}) => {
  const { client, disconnect } = useClient();
  const resetXmtpState = useXmtpStore((s) => s.resetXmtpState);
  const clientName = useXmtpStore((s) => s.clientName);
  const clientAvatar = useXmtpStore((s) => s.clientAvatar);
  const { reset: resetWagmi } = useDisconnect();
  const { disconnect: disconnectWagmi } = useDisconnect();

  return (
    <SideNav
      displayAddress={clientName ?? client?.address}
      walletAddress={client?.address as ETHAddress | undefined}
      avatarUrl={clientAvatar || ""}
      selectedSideNav={selectedSideNav}
      setSelectedSideNav={setSelectedSideNav}
      onDisconnect={() => {
        void disconnect();
        disconnectWagmi();
        wipeKeys(client?.address ?? "");
        resetWagmi();
        resetXmtpState();
      }}
    />
  );
};
