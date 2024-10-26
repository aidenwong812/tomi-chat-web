import { ChevronLeftIcon } from "@heroicons/react/outline";
import { useTranslation } from "react-i18next";
import { IoMdMore } from "react-icons/io";
import { Avatar } from "../Avatar/Avatar";
import { classNames, shortAddress } from "../../../helpers";
import { Search } from "../Search/Search";

interface AddressInputProps {
  /**
   * What, if any, resolved address is there?
   */
  resolvedAddress?: {
    displayAddress: string;
    walletAddress?: string;
  };
  /**
   * What, if any, subtext is there?
   */
  subtext?: string;
  /**
   * What are the props associated with the avatar?
   */
  avatarUrlProps?: {
    // What is the avatar url?
    url?: string;
    // Is the avatar url loading?
    isLoading?: boolean;
    // What's the address of this wallet?
    address?: string;
  };
  /**
   * What happens on a submit?
   */
  onChange?: (value: string) => void;
  /**
   * Upon submit, has there been an error?
   */
  isError?: boolean;
  /**
   * Upon submit, is something loading?
   */
  isLoading?: boolean;
  /**
   * Input Value
   */
  value?: string;
  /**
   * Is there a left icon click event that needs to be handled?
   */
  onLeftIconClick?: () => void;
  /**
   * Is there a right icon click event that needs to be handled?
   */
  onRightIconClick?: () => void;
}

export const AddressInput = ({
  resolvedAddress,
  subtext,
  avatarUrlProps,
  onChange,
  isError,
  value,
  onLeftIconClick,
  onRightIconClick,
}: AddressInputProps) => {
  const { t } = useTranslation();
  const subtextColor = isError ? "text-red-600" : "text-gray-500";
  return (
    <div className="flex flex-col w-full px-4">
      <div className="flex w-full md:hidden py-2">
        <Search onSearch={() => {}} />
      </div>
      <div
        className={classNames(
          !resolvedAddress?.displayAddress
            ? "bg-white dark:bg-[#111111] text-black dark:text-white "
            : "dark:bg-[#0e0e0e] text-black dark:text-white",
          "flex items-center justify-between px-2 md:px-4 py-3 z-10 max-h-sm w-full rounded-bl-2xl border md:border-l md:border-b border-[#FF0083] dark:border-[#000000]",
        )}>
        <div className="hidden w-24 p-0 justify-start">
          <ChevronLeftIcon onClick={onLeftIconClick} width={24} />
        </div>
        <form
          className="flex w-full items-center"
          onSubmit={(e) => e.preventDefault()}>
          <div className="mr-2 font-bold text-sm">
            {t("common.input_label")}:
          </div>
          {resolvedAddress?.displayAddress && <Avatar {...avatarUrlProps} />}
          <div className="ml-2 md:ml-4">
            {resolvedAddress?.displayAddress ? (
              <div
                className="font-bold text-md"
                data-testid="recipient-wallet-address">
                {shortAddress(resolvedAddress.displayAddress)}
              </div>
            ) : (
              <input
                data-testid="message-to-input"
                tabIndex={0}
                className="bg-transparent text-gray-900 dark:text-white px-0 h-4 m-1 ml-0 font-mono text-sm w-full leading-tight border-2 border-transparent focus:border-transparent focus:ring-0 cursor-text"
                id="address"
                type="search"
                spellCheck="false"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                onChange={(e) =>
                  onChange && onChange((e.target as HTMLInputElement).value)
                }
                value={value}
                aria-label={t("aria_labels.address_input") || ""}
              />
            )}
            <div
              className={classNames(
                "font-mono",
                "text-sm",
                "h-5",
                subtextColor,
              )}
              data-testid="message-to-subtext">
              {subtext
                ? t(subtext)
                : resolvedAddress?.walletAddress
                  ? resolvedAddress?.walletAddress
                  : ""}
            </div>
          </div>
        </form>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <Search onSearch={() => {}} />
            </div>
            {onRightIconClick && (
              <IoMdMore className="dark:text-white text-[#FF0083]" />
            )}
          </div>
          <div className="flex justify-end translate-y-[50%]">
            <button
              type="button"
              className="text-sm text-[#FF0083] text-left px-1 w-[50%] bg-white rounded-md dark:border-0 border border-[#FF0083]">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
