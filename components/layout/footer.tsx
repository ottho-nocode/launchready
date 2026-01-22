import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} iPhone Cover Generator by{' '}
          <Link href="https://ottho.co" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            Ottho
          </Link>
        </p>
      </div>
    </footer>
  );
}
