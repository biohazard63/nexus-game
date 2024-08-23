import Image from "next/image";
import LoginForm from "../app/login";
import SignUpForm from "@/app/signup";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SignUpForm />
      <LoginForm />
    </main>
  );
}
