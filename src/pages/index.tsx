import { useEffect, useMemo } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useTheme } from "next-themes";
import { useClient } from "@xmtp/react-sdk";
import { useNavigate } from "react-router-dom";
import { OnboardingStep } from "../component-library/components/OnboardingStep/OnboardingStep";
import { isAppEnvDemo, wipeKeys } from "../helpers";
import useInitXmtpClient from "../hooks/useInitXmtpClient";
import { useXmtpStore } from "../store/xmtp";
import darkBg from "../assets/dark-bg.png";
import lightBg from "../assets/light-bg.png";
// import { Mobile } from "../component-library/components/Mobile/Mobile";
// import useWindowSize from "../hooks/useWindowSize";

const OnboardingPage = () => {
  const navigate = useNavigate();

  const resetXmtpState = useXmtpStore((state) => state.resetXmtpState);
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { client, isLoading, status, setStatus, resolveCreate, resolveEnable } =
    useInitXmtpClient();
  const { reset: resetWagmi, disconnect: disconnectWagmi } = useDisconnect();
  const { disconnect: disconnectClient } = useClient();

  useEffect(() => {
    const routeToInbox = () => {
      if (client) {
        navigate("/inbox");
      }
    };
    routeToInbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const step = useMemo(() => {
    // special demo case that will skip onboarding
    if (isAppEnvDemo()) {
      return 0;
    }
    switch (status) {
      // XMTP identity not created
      case "new":
        return 2;
      // XMTP identity created, but not enabled
      case "created":
        return 3;
      // waiting on wallet connection
      case undefined:
      default:
        return 1;
    }
  }, [status]);

  const { theme } = useTheme() as { theme: string };
  // const size = useWindowSize();

  // size[0] < TAILWIND_MD_BREAKPOINT ? (
  //   <Mobile />
  // ) :

  return (
    // <div className="h-screen w-full overflow-auto bg-[url('/Assets/dark-bg.png')] bg-cover">
    <div className="h-screen w-full overflow-auto">
      {/* console.log("Current theme:", theme.theme); */}
      <img
        src={theme === "light" ? lightBg : darkBg}
        alt="Background"
        className="bg-cover w-full h-full -z-40 absolute"
      />
      <div className="h-screen w-full absolute top-0 left-0 bg-opacity-" />
      <OnboardingStep
        step={step}
        isLoading={isLoading}
        onConnect={openConnectModal}
        onCreate={resolveCreate}
        onEnable={resolveEnable}
        onDisconnect={() => {
          if (client) {
            void disconnectClient();
          }
          disconnectWagmi();
          setStatus(undefined);
          wipeKeys(address ?? "");
          resetWagmi();
          resetXmtpState();
        }}
      />
    </div>
  );
};

export default OnboardingPage;
