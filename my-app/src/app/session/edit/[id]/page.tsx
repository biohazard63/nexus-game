/**
 * Page component
 *
 * This component renders the EditSessionForm component.
 * It serves as the page for editing a session.
 *
 * @component
 * @example
 * return (
 *   <Page />
 * )
 */
import React from 'react';
import EditSessionForm from "@/components/EditSessionForm";

export default function Page() {
  return (
    <div>
        <EditSessionForm />
    </div>
  );
}