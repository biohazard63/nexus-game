/**
 * LoginPage component
 *
 * This component renders the login page, which includes the LoginForm component.
 * It centers the login form both vertically and horizontally on the screen.
 *
 * @component
 * @example
 * return (
 *   <LoginPage />
 * )
 */
import LoginForm from '@/components/login'; // Ensure the import path is correct

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center  ">
            <div className="w-full">
                <LoginForm />
            </div>
        </div>
    );
}