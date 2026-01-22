export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} LaunchReady. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
