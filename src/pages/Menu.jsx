import toast from "react-hot-toast";
import { Link } from "react-router";
import {
  LuDatabaseBackup,
  LuFileText,
  LuGithub,
  LuRotateCcw,
  LuShield,
} from "react-icons/lu";

import GoogleBackupPrompt from "../components/GoogleBackupPrompt";
import GoogleProfile from "../components/GoogleProfile";
import PageContainer from "../components/PageContainer";
import useAppContext from "../hooks/useAppContext";
import useAppStore from "../store/useAppStore";
import usePrompt from "../hooks/usePrompt";
import { SecondaryHeader } from "../components/Header";
import { cn } from "../lib/utils";

const MenuButton = ({
  as: Component = "button", // eslint-disable-line
  ...props
}) => (
  <Component
    {...props}
    className={cn(
      "px-4 py-2 text-sm font-medium cursor-pointer",
      "text-neutral-100 bg-neutral-800 rounded-xl hover:bg-neutral-700",
      "flex items-center gap-2",
      props.className
    )}
  />
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
        <div className="flex p-4 flex-col items-center gap-1">
          <img
            src="/icon.png"
            alt={import.meta.env.VITE_APP_NAME}
            className="size-20 rounded-full object-cover"
          />
          <h1 className="text-pink-500 font-bold text-center">
            {import.meta.env.VITE_APP_NAME}
          </h1>
          <p className="text-neutral-400 text-center">
            {import.meta.env.VITE_APP_DESCRIPTION}
          </p>
        </div>

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
          <LuRotateCcw className="size-5" />
          Reset Tracker
        </MenuButton>

        <hr className="border-neutral-700" />

        <MenuButton as={Link} to="/privacy-policy">
          <LuShield className="size-5" />
          Privacy Policy
        </MenuButton>

        <MenuButton as={Link} to="/terms-of-service">
          <LuFileText className="size-5" />
          Terms of Service
        </MenuButton>

        <MenuButton
          as={Link}
          to={import.meta.env.VITE_APP_REPOSITORY}
          target="_blank"
        >
          <LuGithub className="size-5" />
          Repository
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
