import { SignupForm } from "@/components/auth/SignupForm";

interface SignupProps {
  onSignup: (userData: { id: string; role: string; name: string }) => void;
}

export default function Signup({ onSignup }: SignupProps) {
  return <SignupForm onSignup={onSignup} />;
}