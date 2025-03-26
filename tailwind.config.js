/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
  theme: {
    extend: {
      // You can extend the default theme here
    },
  },
  plugins: [
    // Explicitly add the line-clamp plugin
    require("@tailwindcss/line-clamp"),
  ],
  // No need for line-clamp plugin in Tailwind v3.3+
  // Enable JIT mode for better performance and smaller CSS files
  mode: "jit",
};
