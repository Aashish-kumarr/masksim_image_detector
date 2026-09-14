import { Link } from "react-router-dom";
import PageHeader from "../components/common/PageHeader";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "flex-start" }}>
      <PageHeader
        eyebrow="404 Error"
        title="Page not found"
        description="The requested page route does not exist."
      />
      <div className="card" style={{ maxWidth: "480px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <p style={{ color: "var(--text-secondary)" }}>
          Please use the primary navigation bar above to return to the application or go back to the home page.
        </p>
        <Link to="/" className="btn-primary" style={{ width: "fit-content" }}>
          <ArrowLeft size={16} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
