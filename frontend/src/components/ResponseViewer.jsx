export default function ResponseViewer({ loading, response, responseTab, setResponseTab }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50/50">
        <div className="flex px-4">
          <button
            onClick={() => setResponseTab("body")}
            className={`px-4 py-3 text-sm font-medium transition ${
              responseTab === "body"
                ? "text-orange-600 border-b-2 border-orange-600 bg-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Body
          </button>
          <button
            onClick={() => setResponseTab("headers")}
            className={`px-4 py-3 text-sm font-medium transition ${
              responseTab === "headers"
                ? "text-orange-600 border-b-2 border-orange-600 bg-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Headers
          </button>
        </div>
      </div>
      
      <div>
        {/* Response Header */}
        {response && (
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              response.status >= 200 && response.status < 300
                ? "bg-emerald-100 text-emerald-700"
                : response.status >= 400 && response.status < 500
                ? "bg-amber-100 text-amber-700"
                : response.status >= 500
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}>
              {response.status} {response.statusText}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {response.responseTime}ms
            </span>
            {response.size && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 4 4 4h8c2.5 0 4-2 4-4V7c0-2-1.5-4-4-4H8c-2.5 0-4 2-4 4z" />
                </svg>
                {(response.size / 1024).toFixed(2)} KB
              </span>
            )}
          </div>
        )}
        
        {/* Response Content */}
        <div className="p-4 max-h-[calc(100vh-500px)] min-h-[300px] overflow-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-500 text-sm">Sending request...</p>
            </div>
          ) : response ? (
            responseTab === "body" ? (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm font-mono">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            ) : (
              <div className="space-y-2">
                {Object.entries(response.headers || {}).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                    <span className="text-sm font-mono font-semibold text-orange-600 min-w-[150px]">{key}:</span>
                    <span className="text-sm font-mono text-gray-700 break-all">{value}</span>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
              <p className="text-sm">Click Send to get a response</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}