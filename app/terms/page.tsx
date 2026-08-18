export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Terms &amp; Conditions</h1>
      <div className="prose mt-6 max-w-none text-sm text-muted-foreground">
        <p>
          This is a demo job portal application intended for educational and demonstration purposes.
        </p>
        <p className="mt-4">
          Job listings are sample data. Applications submitted through this platform are stored locally in your browser and are not forwarded to any employer.
        </p>
        <p className="mt-4">
          Use of this application implies acceptance of these terms for the purposes of this demo.
        </p>
      </div>
    </div>
  );
}
