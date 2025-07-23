import toast from "react-hot-toast";
import { LuDatabaseBackup, LuRecycle } from "react-icons/lu";

import GoogleBackupPrompt from "../components/GoogleBackupPrompt";
import GoogleProfile from "../components/GoogleProfile";
import PageContainer from "../components/PageContainer";
import useAppContext from "../hooks/useAppContext";
import useAppStore from "../store/useAppStore";
import usePrompt from "../hooks/usePrompt";
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
  const { googleApi, googleDriveBackup } = useAppContext();
  const setInvestments = useAppStore((state) => state.setInvestments);
  const setWithdrawals = useAppStore((state) => state.setWithdrawals);

  /** Google Drive Backup Prompt */
  const { show, setShow, value, resolve, prompt } = usePrompt();

  const resetTracker = () => {
    setInvestments([]);
    setWithdrawals([]);
    toast.success("Tracker reset successfully!");
  };

  const handleGoogleApiLogout = () => {
    toast.promise(googleApi.logout(), {
      loading: "Logging out...",
      success: "Logged out successfully!",
      error: (error) => `Logout failed: ${error.message}`,
    });
  };

  const handleGoogleDriveConnect = async () => {
    googleDriveBackup.authorize({ prompt });
  };

  return (
    <>
      <SecondaryHeader title="Menu" />
      <PageContainer className="flex flex-col gap-2">
        <GoogleProfile />

        <MenuButton
          onClick={
            googleApi.authorized
              ? handleGoogleApiLogout
              : handleGoogleDriveConnect
          }
        >
          <LuDatabaseBackup className="size-5" />
          {googleApi.authorized
            ? "Disconnect Google Drive"
            : "Connect Google Drive"}
        </MenuButton>
        <MenuButton onClick={resetTracker}>
          <LuRecycle className="size-5" />
          Reset Tracker
        </MenuButton>
      </PageContainer>

      {/* Google Backup Prompt */}
      <GoogleBackupPrompt
        backupFile={value}
        open={show}
        onOpenChange={setShow}
        resolve={resolve}
      />
    </>
  );
}
