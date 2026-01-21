import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} LaunchReady. All rights reserved.
        </p>

        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground hover:underline">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
