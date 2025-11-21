export const FormFieldError = ({
  message,
}: {
  message: string | undefined;
}) => {
  return message ? (
    <p className="text-red-500 text-sm px-4">{message}</p>
  ) : null;
};
