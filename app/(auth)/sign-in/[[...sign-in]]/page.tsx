import { SignIn } from "@clerk/nextjs";
import { AuthToast } from "@/components/auth/auth-toast";

export default function Page() {
  return (
    <>
      <AuthToast />
      <SignIn />
    </>
  );
}
