/**
 * SignUpPage component
 *
 * This component renders the sign-up page with a form for user registration.
 * It centers the form on the screen and applies a background color.
 *
 * @component
 * @example
 * return (
 *   <SignUpPage />
 * )
 */
'use client';

import SignUpForm from "@/components/signup";

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center  ">
            <div className=" max-w-md">
                <SignUpForm />
            </div>
        </div>
    );
}