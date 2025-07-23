import { LuRecycle } from "react-icons/lu";

import PageContainer from "../components/PageContainer";
import useAppStore from "../store/useAppStore";
import { SecondaryHeader } from "../components/Header";
import { cn } from "../lib/utils";

const MenuButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 text-sm font-medium cursor-pointer",
      "text-neutral-100 bg-neutral-800 rounded-xl hover:bg-neutral-700",
      "flex items-center gap-2"
    )}
  >
    {children}
  </button>
);

export default function Menu() {
  const setInvestments = useAppStore((state) => state.setInvestments);
  const setWithdrawals = useAppStore((state) => state.setWithdrawals);

  const resetTracker = () => {
    setInvestments([]);
    setWithdrawals([]);
  };
  return (
    <>
      <SecondaryHeader title="Menu" />
      <PageContainer className="flex flex-col gap-2">
        <MenuButton onClick={resetTracker}>
          <LuRecycle className="size-5" />
          Reset Tracker
        </MenuButton>
      </PageContainer>
    </>
  );
}
