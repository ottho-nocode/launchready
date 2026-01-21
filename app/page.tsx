export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <main className="flex flex-col items-center gap-8 px-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
          LaunchReady
        </h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Generate all your App Store assets in minutes, not hours.
        </p>
        <div className="flex gap-4">
          <a
            href="/generate"
            className="rounded-full bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get Started
          </a>
        </div>
      </main>
    </div>
  );
}
