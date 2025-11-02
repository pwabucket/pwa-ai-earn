import { formatDate } from "date-fns";

import useAppStore from "../store/useAppStore";
import useGoogleProfileQuery from "../hooks/useGoogleProfileQuery";
import { cn } from "../lib/utils";

export default function GoogleProfile() {
  const googleDriveAuthToken = useAppStore(
    (state) => state.googleDriveAuthToken
  );
  const googleDriveBackupFile = useAppStore(
    (state) => state.googleDriveBackupFile
  );
  const googleProfileQuery = useGoogleProfileQuery();
  const profile = googleProfileQuery.data;

  return (
    <>
      {googleDriveAuthToken ? (
        <>
          {profile ? (
            <div
              className={cn(
                "p-2 rounded-xl ",
                "bg-neutral-800",
                "flex items-center gap-2"
              )}
            >
              <img
                src={profile["picture"]}
                className="size-10 shrink-0 rounded-full"
              />

              <div className="flex flex-col gap-1 grow min-w-0">
                <h3 className="truncate font-bold leading-none">
                  {profile["name"]}
                </h3>
                <p className="text-neutral-500 leading-none">
                  {profile["email"]}
                </p>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "p-2 rounded-xl ",
                "bg-neutral-800",
                "flex items-center gap-2"
              )}
            >
              {/* Picture */}
              <div
                className={cn(
                  "size-10 shrink-0 rounded-full",
                  "bg-neutral-700"
                )}
              />

              {/* User Info */}
              <div className="flex flex-col gap-1 grow min-w-0">
                {/* Name */}
                <div className="rounded-full w-5/12 h-3 bg-neutral-700" />

                {/* Email */}
                <div className="rounded-full w-5/6 h-3 bg-neutral-700" />
              </div>
            </div>
          )}
          {googleDriveBackupFile ? (
            <p className="text-sm p-4 rounded-xl bg-neutral-800">
              <span className="font-bold">Last Backup:</span>{" "}
              <span className="text-pink-500 font-bold">
                {formatDate(
                  new Date(googleDriveBackupFile?.modifiedTime || Date.now()),
                  "PPPPpppp"
                )}
              </span>
            </p>
          ) : null}
        </>
      ) : null}
    </>
  );
}
