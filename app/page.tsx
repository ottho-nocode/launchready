import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          LaunchReady
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Generate all your App Store assets in minutes, not hours.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/generate">Get Started</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
