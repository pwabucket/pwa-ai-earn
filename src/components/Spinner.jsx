import { CgSpinner } from "react-icons/cg";
import { memo } from "react";

export default memo(function Spinner() {
  return <CgSpinner className="size-5 mx-auto animate-spin" />;
});
