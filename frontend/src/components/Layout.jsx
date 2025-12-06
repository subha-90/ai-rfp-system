import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      
      {/* Sidebar */}
       <aside className="w-64 bg-slate-900 text-slate-200 p-6 shadow-xl flex flex-col">
        <h1 className="text-2xl font-bold mb-10 text-white tracking-wide">
          AI-RFP System
        </h1>

        <nav className="flex flex-col gap-6 text-lg">
          <Link
            to="/"
            className="flex items-center gap-3 text-slate-300 hover:text-white transition"
          >
            📄 RFPs
          </Link>

          <Link
            to="/create"
            className="flex items-center gap-3 hover:text-white transition"
          >
            ➕ Create RFP
          </Link>

          <Link
            to="/vendors"
            className="flex items-center gap-3 hover:text-white transition"
          >
            🏢 Vendors
          </Link>
        </nav>

        <div className="mt-auto text-sm text-indigo-300 opacity-75">
          © 2025 AI-RFP System
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
