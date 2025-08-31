import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error("ErrorBoundary caught", error, info);
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      return (
        <div style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
          <h2 style={{ color: "#b91c1c" }}>Something crashed</h2>
          <div style={{ marginTop: 8 }}>
            <strong>Error:</strong>
            <pre style={{ whiteSpace: "pre-wrap", background: "#111827", color: "#f8fafc", padding: 12, borderRadius: 6 }}>
              {error && error.toString()}
            </pre>
          </div>
          {info && (
            <details style={{ marginTop: 8 }}>
              <summary>Stack</summary>
              <pre style={{ whiteSpace: "pre-wrap" }}>{info.componentStack}</pre>
            </details>
          )}
          <div style={{ marginTop: 12 }}>
            <button onClick={() => window.location.reload()} style={{ padding: "8px 12px", borderRadius: 6 }}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
