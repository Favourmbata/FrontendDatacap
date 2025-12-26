import ChangePasswordForm from './ChangePasswordForm';

// Server component that resolves the params and renders the client component
const ChangePasswordPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  
  // Pass the resolved ID to the client component
  return <ChangePasswordForm userId={resolvedParams.id} />;
};

// Export the server component as the default
export default ChangePasswordPage;
