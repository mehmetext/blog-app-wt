import { LoginForm } from "./login-form";

export default async function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-6 p-6">
        <LoginForm />
      </div>
    </div>
  );
}
