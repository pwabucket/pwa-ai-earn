import Modal from "./Modal";
import useAppStore from "../store/useAppStore";
import { useUser } from "../hooks/useUser";
import { Dialog } from "radix-ui";
import { LuX } from "react-icons/lu";

export default function WebviewModal({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const url = useAppStore((state) => state.url);
  const user = useUser();

  return (
    <Modal
      onOpenChange={onOpenChange}
      overlayClassName="p-4"
      contentClassName="p-0 h-full max-h-[768px] overflow-hidden gap-0 flex flex-col"
    >
      <Dialog.Title className="sr-only">Webview</Dialog.Title>
      <Dialog.Description className="sr-only">
        Webview modal content
      </Dialog.Description>

      <div className="p-4 flex gap-4 items-center">
        <span className="size-10 shrink-0" />
        <div className="grow min-w-0">
          {user ? (
            <div className="flex items-center justify-center gap-2">
              <img
                src={user["photo_url"]}
                alt={user["first_name"]}
                className="size-10 rounded-full object-cover shrink-0"
              />
              <div className="flex flex-col pr-2 min-w-0">
                <span className="font-bold text-pink-400 truncate">
                  {`${user["first_name"]} ${user["last_name"] || ""}`}
                </span>
                <span className="text-sm text-neutral-400 truncate">
                  @{user["username"] || "Telegram User"}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center">No user info available</div>
          )}
        </div>

        <Dialog.Close className="size-10 shrink-0 flex items-center justify-center cursor-pointer hover:bg-neutral-800 rounded-full">
          <LuX className="size-5" />
        </Dialog.Close>
      </div>
      <iframe
        src={url}
        className="grow border-0 bg-neutral-800/50"
        referrerPolicy="no-referrer"
      />
    </Modal>
  );
}
