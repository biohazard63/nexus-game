import Image from "next/image";
import LoginForm from "../app/login";
import SignUpForm from "@/app/signup";
import {UserTable} from "@/app/UserTable";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SignUpForm />
      <LoginForm />
        <UserTable />
    </main>
  );
}
