import { SignupForm } from "@/components/auth/SignupForm";
import Layout from "@/components/common/Layout";

interface SignupProps {
  onSignup: (userData: { id: string; role: string; name: string }) => void;
}

export default function Signup({ onSignup }: SignupProps) {
  return (
    <Layout>
      <SignupForm onSignup={onSignup} />
    </Layout>
  );
}