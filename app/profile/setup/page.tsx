import { Toaster } from "sonner";
import { ProfileSetupForm } from "../page";

export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <ProfileSetupForm />
      <Toaster />
    </div>
  );
}