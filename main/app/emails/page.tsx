import fs from "fs/promises";
import path from "path";

export const dynamic = "force-static";

export default async function EmailsPage() {
  const emailsDir = path.join(process.cwd(), "emails");
  let files: string[] = [];
  try {
    files = await fs.readdir(emailsDir);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // No emails yet or folder missing
    files = [];
  }

  const emails = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse()
      .map(async (filename) => {
        try {
          const raw = await fs.readFile(path.join(emailsDir, filename), "utf8");
          const parsed = JSON.parse(raw);
          return { filename, parsed };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          return { filename, parsed: null };
        }
      })
  );

  return (
    <div style={{ padding: 24, color: "var(--foreground)", background: "var(--background)" }}>
      {emails.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 64, paddingBottom: 64 }}>
          <h1 style={{ marginBottom: 12, textAlign: "center" }}>Captured Emails</h1>
          <p style={{ color: "var(--muted-foreground)", textAlign: "center", margin: 0 }}>No emails captured yet.</p>
        </div>
      ) : (
        <>
          <h1 style={{ marginBottom: 12 }}>Captured Emails</h1>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {emails.map((e) => (
              <li key={e.filename} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                  <strong style={{ color: "var(--secondary-foreground)" }}>{e.filename}</strong>
                </div>
                <pre style={{ whiteSpace: "pre-wrap", background: "var(--card)", color: "var(--card-foreground)", padding: 12, borderRadius: 8, border: "1px solid var(--border)" }}>
                  {JSON.stringify(e.parsed, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
