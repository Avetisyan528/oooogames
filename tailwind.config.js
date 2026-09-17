module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: Object.fromEntries(
        [
          "background",
          "foreground",
          "primary",
          "secondary",
          "muted",
          "accent",
          "destructive",
          "border",
          "input",
          "ring",
          "card",
          "popover",
        ].map((n) => [n, `hsl(var(--${n}))`]),
      ),
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
