import { SignUpForm } from "@/components/form/SignUpForm";
import { Toaster } from "sonner";


export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <SignUpForm />
      <Toaster />
    </div>
  );
}