/**
 * CreateSessionPage component
 *
 * This component renders the CreateSessionForm component.
 * It serves as the page for creating a new session.
 *
 * @component
 * @example
 * return (
 *   <CreateSessionPage />
 * )
 */
import React from "react";
import CreateSessionForm from "@/components/CreateSessionForm";

export default function CreateSessionPage() {
    return (
        <div>
            <CreateSessionForm />
        </div>
    );
}