

import { SignInForm } from "@/components/form/SignInForm";
import { Toaster } from "sonner";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <SignInForm />
      <Toaster />
    </div>
  );
}