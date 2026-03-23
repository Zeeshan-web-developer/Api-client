export default function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  collections, 
  requestHistory, 
  selectedCollection, 
  setSelectedCollection, 
  loadRequest,
  setShowCollectionModal 
}) {
  const getMethodColor = (method) => {
    const colors = {
      GET: "bg-emerald-100 text-emerald-700 border-emerald-200",
      POST: "bg-blue-100 text-blue-700 border-blue-200",
      PUT: "bg-amber-100 text-amber-700 border-amber-200",
      PATCH: "bg-purple-100 text-purple-700 border-purple-200",
      DELETE: "bg-red-100 text-red-700 border-red-200"
    };
    return colors[method] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className={`${sidebarOpen ? 'w-80' : 'w-12'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative shadow-sm`}>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-6 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-gray-50 z-10"
      >
        <svg className={`w-3 h-3 text-gray-600 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {sidebarOpen && (
        <div className="flex-1 overflow-y-auto">
          {/* Collections Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>COLLECTIONS</span>
              </h3>
              <button 
                onClick={() => setShowCollectionModal(true)}
                className="text-orange-500 hover:text-orange-600 text-xs"
              >
                + New
              </button>
            </div>
            <div className="space-y-2">
              {collections.length === 0 && (
                <div className="text-gray-400 text-xs text-center py-4">
                  No collections yet<br/>
                  <button onClick={() => setShowCollectionModal(true)} className="text-orange-500 hover:underline">Create one</button>
                </div>
              )}
              {collections.map(col => (
                <div key={col.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition">
                  <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                    <span className="font-medium text-sm flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      {col.name}
                    </span>
                    <button
                      onClick={() => setSelectedCollection(col)}
                      className="text-xs text-green-600 hover:text-green-700"
                      title="Save current request"
                    >
                      💾
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                    {col.requests.map(req => (
                      <div
                        key={req.id}
                        onClick={() => loadRequest(req)}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer transition group"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded border ${getMethodColor(req.method)}`}>
                            {req.method}
                          </span>
                          <span className="text-sm text-gray-700 truncate flex-1">
                            {req.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History Section */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center space-x-1 mb-3">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>HISTORY</span>
            </h3>
            <div className="space-y-1">
              {requestHistory.slice(0, 15).map(item => (
                <div
                  key={item.id}
                  onClick={() => loadRequest(item.request)}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-lg transition group"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded border ${getMethodColor(item.request.method)}`}>
                      {item.request.method}
                    </span>
                    <span className="text-xs text-gray-500 truncate flex-1 font-mono">
                      {item.request.url.length > 40 ? item.request.url.substring(0, 40) + '...' : item.request.url}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workspace Info */}
          <div className="p-4 border-t border-gray-100 mt-auto">
            <div className="text-xs text-gray-400 space-y-1">
              <div className="font-mono font-medium">echo-bruno</div>
              <div className="flex gap-2">
                <span className="text-blue-500">POST echo-bru</span>
                <span className="text-purple-500">GQL echo-gql</span>
                <span className="text-green-500">sample.js</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}