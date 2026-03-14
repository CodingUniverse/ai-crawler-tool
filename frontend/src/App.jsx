import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCrawl = async () => {
    if (!url.trim()) {
      setError("Please input a URL");
      setTitle("");
      return;
    }

    setLoading(true);
    setError("");
    setTitle("");

    try {
      const response = await fetch("/crawl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Request failed");
      }

      setTitle(data.title || "No title found");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Simple Web Title Crawler</h1>

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleCrawl} disabled={loading} style={styles.button}>
          {loading ? "Crawling..." : "Start Crawl"}
        </button>

        <div style={styles.resultBox}>
          <strong>Result: </strong>
          {error ? <span style={styles.error}>{error}</span> : <span>{title || "No result yet"}</span>}
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
    background: "#f5f5f5",
    margin: 0,
    padding: "16px",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    margin: 0,
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#0d6efd",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
  resultBox: {
    padding: "12px",
    borderRadius: "8px",
    background: "#f0f0f0",
    wordBreak: "break-word",
  },
  error: {
    color: "#b00020",
  },
};

export default App;
