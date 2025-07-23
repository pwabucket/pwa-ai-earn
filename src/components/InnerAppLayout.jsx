import PageContainer from "../components/PageContainer";
import { SecondaryHeader } from "../components/Header";

export default function InnerAppLayout({ title, children }) {
  return (
    <>
      <SecondaryHeader title={title} />
      <PageContainer className="flex flex-col gap-2">{children}</PageContainer>
    </>
  );
}
