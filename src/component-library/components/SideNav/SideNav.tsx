import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import type { ETHAddress } from "../../../helpers";
import { classNames, shortAddress } from "../../../helpers";
import { AvatarSideNav } from "../Avatar/Avatar";
import { GhostButton } from "../GhostButton/GhostButton";
import { ToggleButton } from "../ToggleButton/ToggleButton";

interface SideNavProps {
  /**
   * Contents inside side nav
   */
  // icon?: React.ReactNode;
  /**
   * What is the display address?
   */
  displayAddress?: string;
  /**
   * What is the wallet address?
   */
  walletAddress?: ETHAddress;
  /**
   * What is the avatarUrl?
   */
  avatarUrl?: string;
  /**
   * What should happen when disconnect is clicked?
   */
  onDisconnect?: () => void;
}

// type Lang = {
//   displayText: string | undefined;
//   isSelected: boolean;
//   lang: string;
// };

const SideNav = ({
  displayAddress,
  walletAddress,
  avatarUrl,
  onDisconnect,
}: SideNavProps) => {
  // const [mappedLangs, setMappedLangs] = useState<Lang[]>([]);
  // When language changes, change the modal text to render the corresponding locale selector within that language
  // useEffect(() => {
  //   const langs = supportedLocales.map((locale: string) => {
  //     const lang = locale?.split("-")?.[0] || "en";
  //     const languageNames = new Intl.DisplayNames([i18next.language], {
  //       type: "language",
  //     });

  //     return {
  //       displayText: languageNames.of(lang),
  //       isSelected: i18next.language === lang,
  //       lang,
  //     };
  //   });
  //   setMappedLangs(langs);
  // }, []);

  const { t } = useTranslation();

  const { setTheme } = useTheme();

  const [isOn, setIsOn] = useState(true);

  const icons = [
    <img
      src={!isOn ? "/icon/chats.svg" : "/icon/chats_white.svg"}
      alt="contacts"
      key="Chats"
      className="mr-4 dark:fill-white fill-black"
      data-testid="Chats-icon"
    />,
    <img
      src={!isOn ? "/icon/rooms.svg" : "/icon/rooms_white.svg"}
      alt="contacts"
      key="Rooms"
      className="mr-4"
      data-testid="Rooms-icon"
    />,
    <img
      src={!isOn ? "/icon/contacts.svg" : "/icon/contacts_white.svg"}
      alt="contacts"
      key="Contacts"
      className="mr-4"
      data-testid="Contacts-icon"
    />,
    <img
      src={!isOn ? "/icon/settings.svg" : "/icon/settings_white.svg"}
      alt="contacts"
      key="Settings"
      className="mr-4"
      data-testid="Settingd-icon"
    />,
  ];
  const [currentIcon, setCurrentIcon] = useState(icons[0].key);

  const mappedButtons = icons.map((icn) => (
    <div className="group flex relative w-full" key={icn.key}>
      <button
        type="button"
        onClick={(event) => {
          setCurrentIcon((event.target as HTMLElement).innerText);
        }}
        aria-label={icn.key as string}
        className={classNames(
          "p-2",
          "pr-8",
          "hover:dark:text-white hover:text-gray-500",
          "dark:text-gray-500 text-black",
          "rounded-lg",
          "w-full",
          "flex",
          "item-center",
          "h-fit",
          "rounded",
          "cursor-pointer",
          "w-[300px]",
        )}>
        <div
          className={classNames(
            "flex items-center h-fit w-full",
            currentIcon === icn.key ||
              (!currentIcon && icons[1].key === icn.key)
              ? "font-bold bg-[#FF0083] rounded-r-full rounded-bl-full py-3 px-5 text-white"
              : "",
          )}>
          {icn}
          <span data-testid={icn.key}>{icn.key}</span>
        </div>
      </button>
    </div>
  ));
  return (
    <div
      className={classNames(
        "flex",
        "flex-col",
        "justify-between",
        "items-center",
        "h-screen",
        "bg-transparent",
        "px-6",
        "shadow-lg text-black dark:text-white",
        "absolute w-[80vw] lg:w-full lg:relative z-50",
      )}>
      <div className="flex flex-col items-start space-y-4 w-full">
        <div className="py-4 flex w-full">
          <div className="w-full">
            <div className="flex flex-col items-center">
              <img
                src="/tomi_logo.svg"
                alt="tomi logo"
                className="w-[233px] h-[65px] my-10"
              />
              <div className="flex items-center justify-center">
                <AvatarSideNav url={avatarUrl} address={walletAddress} />
              </div>
              <div className="flex items-center">
                <div className="flex flex-col px-2 justify-center">
                  <span className="font-bold" data-testid="wallet-address">
                    {displayAddress ? shortAddress(displayAddress) : ""}
                  </span>
                  {walletAddress && displayAddress !== walletAddress && (
                    <button
                      type="button"
                      className="font-sm"
                      onClick={() => {
                        void navigator.clipboard.writeText(walletAddress);
                      }}>
                      {shortAddress(walletAddress)}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start pt-4 space-y-4 w-full">
              {mappedButtons}
              <div className="group flex relative w-full">
                <button
                  type="button"
                  onClick={() => {
                    setIsOn(!isOn);
                    setTheme(isOn ? "dark" : "light");
                  }}
                  className={classNames(
                    "p-2",
                    "pr-8",
                    "hover:dark:text-white hover:text-gray-500",
                    "dark:text-gray-500 text-black",
                    "rounded-lg",
                    "flex",
                    "item-center",
                    "h-fit",
                    "rounded",
                    "cursor-pointer",
                    "gap-3",
                  )}>
                  <img
                    src={
                      !isOn
                        ? "/icon/nightmode.svg"
                        : "/icon/nightmode_white.svg"
                    }
                    alt="contacts"
                    key="nightmode"
                    data-testid="Settingd-icon"
                  />
                  <div className="w-full">
                    {`${isOn ? "Light" : "Night"} Mode`}
                  </div>
                  <div>
                    <ToggleButton
                      isOn={isOn}
                      onToggle={() => {
                        setIsOn(!isOn);
                        setTheme(isOn ? "dark" : "light");
                      }}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center font-bold w-full pb-8">
        <GhostButton
          onClick={onDisconnect}
          label={t("common.disconnect")}
          variant="secondary"
          size="large"
          testId="disconnect-wallet-cta"
          // icon={<DisconnectIcon />}
        />
      </div>
    </div>
  );
};

export default SideNav;
