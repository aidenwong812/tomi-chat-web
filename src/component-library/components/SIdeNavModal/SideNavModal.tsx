import type { Dispatch, SetStateAction } from "react";
import { SideNavController } from "../../../controllers/SideNavController";

const SideNavModal = ({
  selectedSideNav,
  setSelectedSideNav,
  setIsModalOpen,
}: {
  selectedSideNav: string;
  setSelectedSideNav: Dispatch<SetStateAction<string>>;
  setIsModalOpen: (isModalOpen: boolean) => void;
}) => (
  <>
    <div
      className="fixed top-0 left-0 w-full h-full z-50 bg-gray-800 opacity-50"
      onClick={() => setIsModalOpen(false)}
      onKeyDown={(e) => e.key === "Escape" && setIsModalOpen(false)}
      role="button"
      tabIndex={0}
      aria-label="Close side navigation"
    />
    <div className="fixed top-0 left-0 w-[320px] h-screen overflow-x-auto z-50 bg-white dark:bg-black">
      <SideNavController
        selectedSideNav={selectedSideNav}
        setSelectedSideNav={setSelectedSideNav}
      />
    </div>
  </>
);
export default SideNavModal;
