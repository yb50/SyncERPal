import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:8080/api/health")
      .then((res) => res.text())
      .then((text) => setMessage(text))
      .catch(() => setMessage("Could not reach backend. Is it running?"));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h1>SyncERPal</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;