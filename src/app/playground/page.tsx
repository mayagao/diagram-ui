import Link from "next/link";

const demos = [
  {
    category: "Building Blocks",
    items: [
      {
        title: "Basic States",
        description: "Explore idle, running, and finished states",
        href: "/playground/blocks",
      },
      {
        title: "Connection Points",
        description: "Test different connection configurations",
        href: "/playground/blocks/connections",
      },
    ],
  },
  {
    category: "Canvas Features",
    items: [
      {
        title: "Grid System",
        description: "Test grid layouts and snapping",
        href: "/playground/canvas",
      },
      {
        title: "Drag and Drop",
        description: "Experiment with block interactions",
        href: "/playground/canvas/dnd",
      },
    ],
  },
  {
    category: "Panels",
    items: [
      {
        title: "Preview Panel",
        description: "Input/Output preview layouts",
        href: "/playground/panels/preview",
      },
      {
        title: "Config Panel",
        description: "Block configuration controls",
        href: "/playground/panels/config",
      },
    ],
  },
];

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Component Playground</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            ← Back to Home
          </Link>
        </div>

        <div className="space-y-12">
          {demos.map((section) => (
            <div key={section.category}>
              <h2 className="text-2xl font-semibold mb-4">
                {section.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((demo) => (
                  <Link
                    key={demo.href}
                    href={demo.href}
                    className="p-4 border rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <h3 className="text-lg font-medium mb-1">{demo.title}</h3>
                    <p className="text-gray-600 text-sm">{demo.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
