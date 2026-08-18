export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <div className="prose mt-6 max-w-none text-sm text-muted-foreground">
        <p>
          This is a demo application. Your data is stored locally in your browser and is not sent to any server.
        </p>
        <p className="mt-4">
          Any information you enter — profile details, applications, saved jobs and resumes — remains in your device's local storage and can be cleared at any time by clearing your browser data.
        </p>
        <p className="mt-4">
          No personal data is collected, shared, or sold to third parties.
        </p>
      </div>
    </div>
  );
}
