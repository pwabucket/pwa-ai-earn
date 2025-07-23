import InnerAppLayout from "../components/InnerAppLayout";
import MarkdownRender from "../components/MarkdownRenderer";
import privacyPolicy from "../../privacy-policy.md?raw";

export default function PrivacyPolicy() {
  return (
    <InnerAppLayout title="Privacy Policy">
      <MarkdownRender content={privacyPolicy} />
    </InnerAppLayout>
  );
}
