import SignUpForm from "@/components/signup";

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <SignUpForm />
            </div>
        </div>
    );
}