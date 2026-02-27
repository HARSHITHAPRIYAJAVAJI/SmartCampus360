import { LoginForm } from "@/components/auth/LoginForm";
import Layout from "@/components/common/Layout";

interface LoginProps {
  onLogin: (userData: { id: string; role: string; name: string }) => void;
  userType?: 'student' | 'staff' | 'admin';
}

export default function Login({ onLogin, userType = 'student' }: LoginProps) {
  const content = {
    student: {
      title: "Student Portal Login",
      description: "Access your dashboard, grades, and academic schedule."
    },
    staff: {
      title: "Faculty & Staff Portal",
      description: "Manage your classes, leave applications, and profile."
    },
    admin: {
      title: "Administrative Console",
      description: "System administration, user management, and reporting."
    }
  };

  const { title, description } = content[userType] || content.student;

  return (
    <Layout>
      <LoginForm
        onLogin={onLogin}
        defaultRole={userType}
        title={title}
        description={description}
        disableRoleSelection={true}
      />
    </Layout>
  );
}