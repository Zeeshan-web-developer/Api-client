export default function HeadersTab({ headers, setHeaders }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">Request Headers</span>
        <button
          onClick={() => setHeaders([...headers, { key: "", value: "", enabled: true }])}
          className="text-orange-500 hover:text-orange-600 text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Header
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-gray-600">KEY</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-600">VALUE</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-600 w-20">ENABLED</th>
              <th className="w-12 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {headers.map((header, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => {
                      const newHeaders = [...headers];
                      newHeaders[idx].key = e.target.value;
                      setHeaders(newHeaders);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
                    placeholder="Header name"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => {
                      const newHeaders = [...headers];
                      newHeaders[idx].value = e.target.value;
                      setHeaders(newHeaders);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="Header value"
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) => {
                      const newHeaders = [...headers];
                      newHeaders[idx].enabled = e.target.checked;
                      setHeaders(newHeaders);
                    }}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => setHeaders(headers.filter((_, i) => i !== idx))}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}