import AccountSwitcherButton from "./AccountSwitcherButton";
import AccountsDialog from "./AccountsDialog";
import PageContainer from "./PageContainer";
import { cn } from "../lib/utils";
import { useLocationToggle } from "@pwabucket/pwa-router";

export default function Footer() {
  const [showAccountsDialog, toggleAccountsDialog] =
    useLocationToggle("accounts-dialog");

  return (
    <div className="h-14">
      <div
        className={cn(
          "flex items-center h-14",
          "bg-neutral-900 border-t border-neutral-800",
          "fixed bottom-0 inset-x-0 z-10",
        )}
      >
        <PageContainer className="flex justify-center py-0">
          <AccountSwitcherButton
            onClick={() => toggleAccountsDialog(true)}
            className="before:size-5 before:shrink-0"
          />

          {showAccountsDialog && (
            <AccountsDialog onClose={() => toggleAccountsDialog(false)} />
          )}
        </PageContainer>
      </div>
    </div>
  );
}
