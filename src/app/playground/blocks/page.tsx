import Link from "next/link";

export default function BlocksDemo() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Building Block States</h1>
          <Link
            href="/playground"
            className="text-blue-500 hover:text-blue-600"
          >
            ← Back to Playground
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Placeholder for state demos */}
          <div className="border rounded-lg p-6 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
              Idle
            </div>
            <p className="text-sm text-gray-600">Default state</p>
          </div>

          <div className="border rounded-lg p-6 flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-100 rounded-lg mb-4 flex items-center justify-center animate-pulse">
              Running
            </div>
            <p className="text-sm text-gray-600">Processing state</p>
          </div>

          <div className="border rounded-lg p-6 flex flex-col items-center">
            <div className="w-24 h-24 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
              Finished
            </div>
            <p className="text-sm text-gray-600">Completed state</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Block Size
              </label>
              <input
                type="range"
                min="64"
                max="200"
                defaultValue="96"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Animation Speed
              </label>
              <select className="block w-full border rounded-md py-2 px-3">
                <option>Slow</option>
                <option>Normal</option>
                <option>Fast</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
