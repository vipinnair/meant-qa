export default function Footer() {
  return (
    <footer className="w-full border-t mt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600">
        © {new Date().getFullYear()} MEANT. All rights reserved.
      </div>
    </footer>
  );
}
