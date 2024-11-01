import { useTranslation, Trans } from "react-i18next";
import { useTheme } from "next-themes";
import { FaSun, FaMoon } from "react-icons/fa";
import { Spinner } from "../Loaders/Spinner";
import { ctaStep, stepMapping } from "./stepMapping";
import { GhostButton } from "../GhostButton/GhostButton";
import { PillButton } from "../PillButton/PillButton";
import logo from "./Assets/logo.png";
import logoMesh_dark from "./Assets/logoMesh_dark.svg";
import logoMesh_light from "./Assets/logoMesh_light.svg";

interface OnboardingStepProps {
  /**
   * What step in the process is this?
   */
  step: number;
  /**
   * Is the message content loading?
   */
  isLoading?: boolean;
  /**
   * What function should be run to connect to a wallet?
   */
  onConnect?: () => void;
  /**
   * What function should be run to create an XMTP identity?
   */
  onCreate?: () => void;
  /**
   * What function should be run to enable an XMTP identity?
   */
  onEnable?: () => void;
  /**
   * What function should be run to disconnect a wallet?
   */
  onDisconnect?: () => void;
}

export const OnboardingStep = ({
  step,
  isLoading,
  onConnect,
  onCreate,
  onEnable,
  onDisconnect,
}: OnboardingStepProps) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme() as {
    theme: string;
    setTheme: (theme: string) => void;
  };
  const stepInfo = isLoading
    ? stepMapping[step]?.loading
    : stepMapping[step]?.default;

  if (stepInfo) {
    const { cta, subtext, disconnect_tip } = stepInfo;

    return (
      <div className="flex flex-col justify-between items-center text-center m-auto w-full p-4 h-full">
        <div className="flex justify-center items-center h-[20vh]">
          <img
            src={logo}
            alt="XMTP Logo"
            className="w-[180px] absolute sm:left-[15%] top-[7vh]"
          />
          <div className=" w-[40px] h-[40px] items-center justify-center absolute right-[10%] top-[12vh]">
            <button
              type="button"
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
              }}
              className="w-auto h-auto text-sm text-2xl max-sm:text-xl">
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
        {isLoading ? <Spinner /> : null}
        <div className="h-[60vh] w-full flex flex-col justify-between items-center">
          <div className="max-w-[752px] min-w-[330px] h-[300px] bg-[#FF0083] bg-opacity-15 border-[#ff008326] border-2 rounded-[40PX] p-4 px-8 z-20 flex flex-col justify-between items-center mx-4 ">
            <img
              src={theme === "light" ? logoMesh_dark : logoMesh_light}
              alt="XMTP Logo Mesh"
              className="h-[24%]"
            />

            <p className="text-xl">Please connect your wallet to begin.</p>
            <div>
              {cta === ctaStep.ENABLE ? (
                <PillButton
                  label={t("onboarding.enable_button")}
                  onClick={onEnable}
                  testId="enable-xmtp-identity-cta"
                />
              ) : cta === ctaStep.CREATE ? (
                <PillButton
                  label={t("onboarding.create_button")}
                  onClick={onCreate}
                  testId="create-xmtp-identity-cta"
                />
              ) : cta === ctaStep.CONNECT ? (
                <PillButton
                  label={t("onboarding.intro_button")}
                  onClick={onConnect}
                  testId="no-wallet-connected-cta"
                />
              ) : null}
            </div>
            {step > 1 ? (
              <GhostButton
                onClick={onDisconnect}
                label={t("common.disconnect")}
                variant="secondary"
              />
            ) : null}
            {subtext ? (
              <p
                className="font-bold text-md text-gray-500"
                data-testid={step === 1 && "no-wallet-connected-subtext"}>
                {t(subtext)}
              </p>
            ) : null}
          </div>
          {disconnect_tip ? (
            <div className="text-md mt-2">
              <Trans data-testid={step === 1 && "disconnect_tip"}>
                {t(disconnect_tip)}
              </Trans>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
  return null;
};
