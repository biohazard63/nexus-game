import LoginForm from '@/components/login'; // Assurez-vous que le chemin d'import est correct

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full ">
                <LoginForm />
            </div>
        </div>
    );
}