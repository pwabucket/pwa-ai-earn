import type { Account } from "../types/app";
import { Button } from "./Button";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "./Input";
import * as yup from "yup";
import { Label } from "./Label";
import { FormFieldError } from "./FormFieldError";
import { cn, copyToClipboard } from "../lib/utils";
import { MdDelete, MdOutlineContentCopy, MdWarning } from "react-icons/md";

/** Account Form Data */
interface AccountFormData {
  title: string;
  url?: string;
}
/** Account Form Schema */
const AccountFormSchema = yup
  .object({
    title: yup.string().required().label("Title"),
    url: yup.string().url().label("URL"),
  })
  .required();

interface AccountEditFormProps {
  account: Account;
  canDelete?: boolean;
  onSubmit: (data: AccountFormData) => void;
  onDelete: () => void;
}

export default function AccountEditForm({
  account,
  canDelete = true,
  onSubmit,
  onDelete,
}: AccountEditFormProps) {
  /** Form */
  const form = useForm({
    resolver: yupResolver(AccountFormSchema),
    defaultValues: {
      title: account?.title || "",
      url: account?.url || "",
    },
  });

  const handleFormSubmit = (data: AccountFormData) => {
    onSubmit(data);
  };
  const handleDelete = () => {
    onDelete();
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-2"
      >
        {/* Title */}
        <Controller
          name="title"
          render={({ field, fieldState }) => (
            <>
              <Label htmlFor="title">Account Title</Label>
              <Input
                {...field}
                id="title"
                autoComplete="off"
                placeholder="Account Title"
              />
              <FormFieldError message={fieldState.error?.message} />
            </>
          )}
        />

        {/* URL */}
        <Controller
          name="url"
          render={({ field, fieldState }) => (
            <>
              <Label htmlFor="url">URL</Label>
              <div className="flex gap-2 w-full">
                <Input
                  {...field}
                  id="url"
                  autoComplete="off"
                  placeholder="URL (optional)"
                  className="grow"
                />
                <button
                  type="button"
                  className={cn(
                    "bg-neutral-800 cursor-pointer",
                    "shrink-0 p-2 rounded-xl size-10",
                    "flex items-center justify-center"
                  )}
                  onClick={() => copyToClipboard(field.value)}
                >
                  <MdOutlineContentCopy className="size-4" />
                </button>
              </div>

              <FormFieldError message={fieldState.error?.message} />
            </>
          )}
        />

        <Button type="submit" className="mt-4">
          Save
        </Button>

        {canDelete ? (
          <>
            {/* Divider */}
            <p className="my-2 text-neutral-400 text-center">OR</p>

            {/* Danger Zone */}
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <MdWarning className="size-5 text-red-400" />
                <h3 className="font-semibold text-red-400">Danger Zone</h3>
              </div>
              <p className="text-sm text-red-300/80 mb-3">
                This action cannot be undone. This will permanently delete the
                account and all associated data.
              </p>

              {/* Delete Account Button */}
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 text-red-200 hover:text-red-500 cursor-pointer transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 w-full"
              >
                <MdDelete className="size-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </>
        ) : null}
      </form>
    </FormProvider>
  );
}
