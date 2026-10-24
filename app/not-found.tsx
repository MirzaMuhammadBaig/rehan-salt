// Fallback 404 for URLs outside any language (rare; the proxy adds a language to almost everything).
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif", background: "#072a33", color: "#eef6f7", textAlign: "center" }}>
        <div>
          <h1 style={{ fontSize: "3rem", margin: 0 }}>404</h1>
          <p>This page could not be found.</p>
          <a href="/" style={{ color: "#f6b8a5", fontWeight: 600 }}>Rehan Salt home</a>
        </div>
      </body>
    </html>
  );
}
