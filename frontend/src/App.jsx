import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:3002";
export default function App() {
  // State management
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState([
    { key: "Content-Type", value: "application/json", enabled: true }
  ]);
  const [body, setBody] = useState("");
  const [bodyType, setBodyType] = useState("none");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("body");
  const [collections, setCollections] = useState([]);
  const [environments, setEnvironments] = useState({
    development: { baseUrl: "https://jsonplaceholder.typicode.com" },
    production: { baseUrl: "https://api.example.com" }
  });
  const [activeEnv, setActiveEnv] = useState("development");
  const [showEnvModal, setShowEnvModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [requestHistory, setRequestHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [params, setParams] = useState([]);
  const [auth, setAuth] = useState({ type: "none", data: {} });

  // Load data from localStorage
  useEffect(() => {
    const savedCollections = localStorage.getItem("postman-collections");
    const savedHistory = localStorage.getItem("postman-history");
    const savedEnvironments = localStorage.getItem("postman-environments");
    
    if (savedCollections) setCollections(JSON.parse(savedCollections));
    if (savedHistory) setRequestHistory(JSON.parse(savedHistory));
    if (savedEnvironments) setEnvironments(JSON.parse(savedEnvironments));
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("postman-collections", JSON.stringify(collections));
    localStorage.setItem("postman-history", JSON.stringify(requestHistory));
    localStorage.setItem("postman-environments", JSON.stringify(environments));
  }, [collections, requestHistory, environments]);

  // Build URL with query params
  const buildUrl = () => {
    let baseUrl = url;
    if (environments[activeEnv]?.baseUrl && url.startsWith("/")) {
      baseUrl = environments[activeEnv].baseUrl + url;
    }
    
    const activeParams = params.filter(p => p.enabled && p.key);
    if (activeParams.length > 0) {
      const queryString = activeParams
        .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join("&");
      baseUrl += (baseUrl.includes("?") ? "&" : "?") + queryString;
    }
    
    return baseUrl;
  };

  // Send request
  const sendRequest = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const finalUrl = buildUrl();
      console.log("Received response:", finalUrl);

      const activeHeaders = headers
        .filter(h => h.enabled && h.key)
        .reduce((obj, h) => ({ ...obj, [h.key]: h.value }), {});

      let requestBody = null;
      if (bodyType === "json" && body) {
        requestBody = JSON.parse(body);
      } else if (bodyType === "form-data") {
        requestBody = body;
      }

      const res = await axios.post(`${API_URL}/api/request`, {
        url: finalUrl,
        method,
        headers: activeHeaders,
        body: requestBody,
        timeout: 30000
      });
      const responseTime = Date.now() - startTime;
      const responseData = { ...res.data, responseTime };
      setResponse(responseData);
      
      // Save to history
      const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        request: { url: finalUrl, method, headers: activeHeaders, body: requestBody },
        response: responseData
      };
      setRequestHistory(prev => [historyItem, ...prev].slice(0, 50));
      
    } catch (err) {
      setResponse({
        error: err.message,
        status: 500,
        responseTime: Date.now() - startTime
      });
    } finally {
      setLoading(false);
    }
  };

  // Collection management
  const createCollection = () => {
    if (newCollectionName) {
      const newCollection = {
        id: Date.now(),
        name: newCollectionName,
        requests: [],
        createdAt: new Date().toISOString()
      };
      setCollections([...collections, newCollection]);
      setNewCollectionName("");
      setShowCollectionModal(false);
    }
  };

  const saveToCollection = () => {
    if (selectedCollection) {
      const updatedCollections = collections.map(col => {
        if (col.id === selectedCollection.id) {
          return {
            ...col,
            requests: [...col.requests, {
              id: Date.now(),
              name: url.split("/").pop() || "New Request",
              method,
              url,
              headers,
              body,
              bodyType,
              params,
              auth,
              createdAt: new Date().toISOString()
            }]
          };
        }
        return col;
      });
      setCollections(updatedCollections);
      alert("Saved to collection!");
    }
  };

  const loadRequest = (req) => {
    setUrl(req.url);
    setMethod(req.method);
    setHeaders(req.headers || [{ key: "Content-Type", value: "application/json", enabled: true }]);
    setBody(req.body || "");
    setBodyType(req.bodyType || "none");
    setParams(req.params || []);
    setAuth(req.auth || { type: "none", data: {} });
  };

  // Environment management
  const updateEnvironment = (envName, key, value) => {
    setEnvironments(prev => ({
      ...prev,
      [envName]: { ...prev[envName], [key]: value }
    }));
  };

  // Format JSON
  const formatJSON = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(body), null, 2);
      setBody(formatted);
    } catch (e) {
      alert("Invalid JSON");
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🚀</span>
          <h1>API Studio</h1>
        </div>
        <div className="header-actions">
          <select value={activeEnv} onChange={(e) => setActiveEnv(e.target.value)}>
            {Object.keys(environments).map(env => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>
          <button onClick={() => setShowEnvModal(true)}>⚙️ Environments</button>
          <button onClick={() => setShowCollectionModal(true)}>📁 New Collection</button>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
          
          {sidebarOpen && (
            <>
              <div className="sidebar-section">
                <h3>📚 Collections</h3>
                {collections.map(col => (
                  <div key={col.id} className="collection-item">
                    <div className="collection-header">
                      <span>📁 {col.name}</span>
                      <button onClick={() => setSelectedCollection(col)}>+</button>
                    </div>
                    <div className="collection-requests">
                      {col.requests.map(req => (
                        <div key={req.id} className="request-item" onClick={() => loadRequest(req)}>
                          <span className={`method-badge method-${req.method}`}>{req.method}</span>
                          <span className="request-name">{req.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="sidebar-section">
                <h3>📜 History</h3>
                {requestHistory.slice(0, 10).map(item => (
                  <div key={item.id} className="history-item" onClick={() => loadRequest(item.request)}>
                    <span className={`method-badge method-${item.request.method}`}>{item.request.method}</span>
                    <span className="history-url">{item.request.url.split("/").pop()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Request Bar */}
          <div className="request-bar">
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="method-select">
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>PATCH</option>
              <option>DELETE</option>
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter request URL"
              className="url-input"
            />
            <button onClick={sendRequest} disabled={loading} className="send-button">
              {loading ? "Sending..." : "Send"}
            </button>
          </div>

          {/* Request Tabs */}
          <div className="request-tabs">
            <button className={`tab ${activeTab === "params" ? "active" : ""}`} onClick={() => setActiveTab("params")}>
              Params
            </button>
            <button className={`tab ${activeTab === "auth" ? "active" : ""}`} onClick={() => setActiveTab("auth")}>
              Authorization
            </button>
            <button className={`tab ${activeTab === "headers" ? "active" : ""}`} onClick={() => setActiveTab("headers")}>
              Headers
            </button>
            <button className={`tab ${activeTab === "body" ? "active" : ""}`} onClick={() => setActiveTab("body")}>
              Body
            </button>
          </div>

          {/* Params Tab */}
          {activeTab === "params" && (
            <div className="params-section">
              <table className="params-table">
                <thead>
                  <tr><th>Key</th><th>Value</th><th>Description</th><th></th></tr>
                </thead>
                <tbody>
                  {params.map((param, idx) => (
                    <tr key={idx}>
                      <td><input type="text" value={param.key} onChange={(e) => {
                        const newParams = [...params];
                        newParams[idx].key = e.target.value;
                        setParams(newParams);
                      }} /></td>
                      <td><input type="text" value={param.value} onChange={(e) => {
                        const newParams = [...params];
                        newParams[idx].value = e.target.value;
                        setParams(newParams);
                      }} /></td>
                      <td><input type="text" value={param.desc || ""} onChange={(e) => {
                        const newParams = [...params];
                        newParams[idx].desc = e.target.value;
                        setParams(newParams);
                      }} /></td>
                      <td><button onClick={() => setParams(params.filter((_, i) => i !== idx))}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="add-button" onClick={() => setParams([...params, { key: "", value: "", enabled: true }])}>
                + Add Parameter
              </button>
            </div>
          )}

          {/* Headers Tab */}
          {activeTab === "headers" && (
            <div className="headers-section">
              <table className="headers-table">
                <thead>
                  <tr><th>Key</th><th>Value</th><th></th></tr>
                </thead>
                <tbody>
                  {headers.map((header, idx) => (
                    <tr key={idx}>
                      <td><input type="text" value={header.key} onChange={(e) => {
                        const newHeaders = [...headers];
                        newHeaders[idx].key = e.target.value;
                        setHeaders(newHeaders);
                      }} /></td>
                      <td><input type="text" value={header.value} onChange={(e) => {
                        const newHeaders = [...headers];
                        newHeaders[idx].value = e.target.value;
                        setHeaders(newHeaders);
                      }} /></td>
                      <td>
                        <input type="checkbox" checked={header.enabled} onChange={(e) => {
                          const newHeaders = [...headers];
                          newHeaders[idx].enabled = e.target.checked;
                          setHeaders(newHeaders);
                        }} />
                        <button onClick={() => setHeaders(headers.filter((_, i) => i !== idx))}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="add-button" onClick={() => setHeaders([...headers, { key: "", value: "", enabled: true }])}>
                + Add Header
              </button>
            </div>
          )}

          {/* Body Tab */}
          {activeTab === "body" && (
            <div className="body-section">
              <div className="body-type-selector">
                <button className={bodyType === "none" ? "active" : ""} onClick={() => setBodyType("none")}>None</button>
                <button className={bodyType === "json" ? "active" : ""} onClick={() => setBodyType("json")}>JSON</button>
                <button className={bodyType === "form-data" ? "active" : ""} onClick={() => setBodyType("form-data")}>Form Data</button>
                <button className={bodyType === "x-www-form-urlencoded" ? "active" : ""} onClick={() => setBodyType("x-www-form-urlencoded")}>x-www-form-urlencoded</button>
              </div>
              
              {bodyType === "json" && (
                <div className="json-editor">
                  <div className="editor-toolbar">
                    <button onClick={formatJSON}>Format JSON</button>
                  </div>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder='{\n  "key": "value"\n}'
                    className="json-textarea"
                    rows={12}
                  />
                </div>
              )}
              
              {bodyType === "form-data" && (
                <div className="form-data-editor">
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="key1=value1&key2=value2"
                    className="form-textarea"
                    rows={8}
                  />
                </div>
              )}
            </div>
          )}

          {/* Response Section */}
          <div className="response-section">
            <div className="response-header">
              <h3>Response</h3>
              {response && (
                <div className="response-meta">
                  <span className={`status-badge status-${Math.floor(response.status / 100)}xx`}>
                    {response.status} {response.statusText}
                  </span>
                  <span className="response-time">⏱️ {response.responseTime || response.time || 0}ms</span>
                  {response.size && <span className="response-size">📦 {response.size} bytes</span>}
                </div>
              )}
            </div>
            
            <div className="response-body">
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Sending request...</p>
                </div>
              ) : response ? (
                <pre>{JSON.stringify(response.data || response, null, 2)}</pre>
              ) : (
                <div className="empty-response">Click Send to get a response</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEnvModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Environment Variables</h3>
            {Object.entries(environments).map(([envName, envData]) => (
              <div key={envName} className="env-editor">
                <h4>{envName}</h4>
                <input
                  type="text"
                  placeholder="Base URL"
                  value={envData.baseUrl || ""}
                  onChange={(e) => updateEnvironment(envName, "baseUrl", e.target.value)}
                />
              </div>
            ))}
            <button onClick={() => setShowEnvModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showCollectionModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Collection</h3>
            <input
              type="text"
              placeholder="Collection Name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={createCollection}>Create</button>
              <button onClick={() => setShowCollectionModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}