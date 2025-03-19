import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Diagram UI Prototype</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/editor"
          className="p-6 border rounded-lg hover:border-blue-500 transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">Editor →</h2>
          <p className="text-gray-600">
            Build and edit your diagrams in the main editor interface.
          </p>
        </Link>
        <Link
          href="/playground"
          className="p-6 border rounded-lg hover:border-blue-500 transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">Playground →</h2>
          <p className="text-gray-600">
            Experiment with components and features in isolation.
          </p>
        </Link>
      </div>
    </main>
  );
}
