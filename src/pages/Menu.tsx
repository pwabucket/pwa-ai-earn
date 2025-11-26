import toast from "react-hot-toast";
import { Link } from "react-router";
import {
  LuCheck,
  LuDatabaseBackup,
  LuFileText,
  LuGithub,
  LuLink,
  LuRadio,
  LuRotateCcw,
  LuShield,
  LuUpload,
  LuUser,
} from "react-icons/lu";

import GoogleBackupPrompt from "../components/GoogleBackupPrompt";
import GoogleProfile from "../components/GoogleProfile";
import PageContainer from "../components/PageContainer";
import useAppContext from "../hooks/useAppContext";
import useAppStore from "../store/useAppStore";
import usePrompt from "../hooks/usePrompt";
import type { DynamicComponent } from "../types/types";
import type { GoogleDriveBackupFile } from "../types/app";
import { SecondaryHeader } from "../components/Header";
import { cn } from "../lib/utils";
import useLocationToggle from "../hooks/useLocationToggle";
import URLModal from "../components/URLModal";
import useActiveAccount from "../hooks/useActiveAccount";
import LabelToggle from "../components/LabelToggle";
import AccountsDialog from "../components/AccountsDialog";
import AccountSwitcherButton from "../components/AccountSwitcherButton";
import { createAndDownloadBackup } from "../lib/backup";
import AccountInfoModal from "../components/AccountInfoModal";
import RestoreDialog from "../components/RestoreDialog";

const MenuButton: DynamicComponent<"button"> = ({ as, ...props }) => {
  const Component = as || "button";
  return (
    <Component
      {...props}
      className={cn(
        "px-4 py-2 text-sm font-medium cursor-pointer",
        "text-neutral-100 bg-neutral-800 rounded-xl hover:bg-neutral-700",
        "flex items-center gap-2 text-left",
        props.className
      )}
    />
  );
};

const MenuSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2 py-1">
      <h2 className="text-neutral-400 font-bold text-sm px-4">{title}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

export default function Menu() {
  const [showAccountsDialog, toggleAccountsDialog] =
    useLocationToggle("accounts-dialog");
  const [showURLModal, setShowURLModal] = useLocationToggle("menu-url-modal");
  const [showAccountInfoModal, setShowAccountInfoModal] = useLocationToggle(
    "menu-account-info-modal"
  );
  const [showRestoreDialog, setShowRestoreDialog] = useLocationToggle(
    "menu-restore-dialog"
  );

  const { googleApi, googleDriveBackup } = useAppContext();

  const account = useActiveAccount();
  const url = account.url;

  const updateAccount = useAppStore((state) => state.updateAccount);
  const setTransactions = useAppStore((state) => state.setTransactions);

  /** Create Backup */
  const createBackup = () => {
    createAndDownloadBackup();
    toast.success("Backup created and downloaded successfully!");
  };

  /** Google Drive Backup Prompt */
  const { show, setShow, value, resolve, prompt } = usePrompt<
    GoogleDriveBackupFile,
    boolean
  >();

  const resetTracker = () => {
    setTransactions(account.id, []);
    toast.success("Tracker reset successfully!");
  };

  const handleGoogleApiLogout = () => {
    toast.promise(googleApi!.logout(), {
      loading: "Logging out...",
      success: "Logged out successfully!",
      error: (error) => `Logout failed: ${error.message}`,
    });
  };

  const handleGoogleDriveConnect = async () => {
    googleDriveBackup!.authorize({ prompt });
  };

  return (
    <>
      {showAccountsDialog && (
        <AccountsDialog onClose={() => toggleAccountsDialog(false)} />
      )}
      <SecondaryHeader title="Menu" />
      <PageContainer className="flex flex-col gap-2">
        <div className="flex p-4 flex-col items-center gap-1">
          <img
            src="/icon.png"
            alt={import.meta.env.VITE_APP_NAME}
            className="size-24 rounded-full object-cover"
          />
          <p className="text-neutral-400 text-center">
            {import.meta.env.VITE_APP_DESCRIPTION}
          </p>
          <p className="text-center text-neutral-400">
            v{import.meta.env.PACKAGE_VERSION}
          </p>

          <AccountSwitcherButton
            onClick={() => toggleAccountsDialog(true)}
            className={cn("bg-neutral-800 rounded-full mx-auto  p-2")}
          />
        </div>

        <GoogleProfile />

        <MenuButton
          onClick={
            googleApi!.authorized
              ? handleGoogleApiLogout
              : handleGoogleDriveConnect
          }
        >
          <LuDatabaseBackup className="size-5" />
          {googleApi!.authorized
            ? "Disconnect Google Drive"
            : "Connect Google Drive"}
        </MenuButton>

        <MenuSection title="Account Settings">
          {/* URL button */}
          <MenuButton onClick={() => setShowURLModal(true)}>
            <LuLink className="size-5" />
            <span className="grow">Set URL</span>
            {url && <LuCheck className="text-green-500 text-xs" />}
          </MenuButton>

          {/* URL Modal */}
          {showURLModal && <URLModal onOpenChange={setShowURLModal} />}

          {/* Enable live updates */}
          <LabelToggle
            disabled={!url}
            checked={account.enableLiveUpdates ?? true}
            onChange={(ev) =>
              updateAccount(account.id, {
                enableLiveUpdates: ev.target.checked,
              })
            }
          >
            <LuRadio className="size-5" />
            Enable Live Updates
          </LabelToggle>

          {/* Account Info button */}
          <MenuButton onClick={() => setShowAccountInfoModal(true)}>
            <LuUser className="size-5" />
            Account Info
          </MenuButton>

          {/* Account Info Modal */}
          {showAccountInfoModal && (
            <AccountInfoModal onOpenChange={setShowAccountInfoModal} />
          )}
        </MenuSection>

        {/* Data section */}
        <MenuSection title="Data Management">
          <MenuButton onClick={createBackup}>
            <LuDatabaseBackup className="size-5" />
            Backup Data
          </MenuButton>

          <MenuButton onClick={() => setShowRestoreDialog(true)}>
            <LuUpload className="size-5" />
            Restore Data
          </MenuButton>

          {/* Restore Dialog */}
          {showRestoreDialog && (
            <RestoreDialog onClose={() => setShowRestoreDialog(false)} />
          )}

          <MenuButton onClick={resetTracker}>
            <LuRotateCcw className="size-5" />
            Reset Tracker
          </MenuButton>
        </MenuSection>

        {/* Legal and Source Codes section */}
        <MenuSection title="Legal & Source Code">
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
        </MenuSection>
      </PageContainer>

      {/* Google Backup Prompt */}
      <GoogleBackupPrompt
        backupFile={value as GoogleDriveBackupFile}
        open={show}
        onOpenChange={setShow}
        resolve={resolve}
      />
    </>
  );
}
