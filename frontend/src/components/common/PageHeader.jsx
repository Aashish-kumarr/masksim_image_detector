export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="page-header">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
          <h1 className="page-title">{title}</h1>
          {description && <p className="page-description">{description}</p>}
        </div>
        {actions && <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>{actions}</div>}
      </div>
    </div>
  );
}
