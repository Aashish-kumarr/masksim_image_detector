import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppShell({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}
