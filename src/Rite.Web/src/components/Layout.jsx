import { Outlet } from "react-router-dom";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import { MockBanner } from "./MockBanner.jsx";

export function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <MockBanner />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
