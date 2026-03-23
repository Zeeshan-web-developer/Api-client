export default function ParamsTab({ params, setParams }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">Query Parameters</span>
        <button
          onClick={() => setParams([...params, { key: "", value: "", enabled: true, desc: "" }])}
          className="text-orange-500 hover:text-orange-600 text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Parameter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-3 text-xs font-semibold text-gray-600">KEY</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-600">VALUE</th>
              <th className="text-left p-3 text-xs font-semibold text-gray-600">DESCRIPTION</th>
              <th className="w-12 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {params.map((param, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-2">
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => {
                      const newParams = [...params];
                      newParams[idx].key = e.target.value;
                      setParams(newParams);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="key"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => {
                      const newParams = [...params];
                      newParams[idx].value = e.target.value;
                      setParams(newParams);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="value"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="text"
                    value={param.desc || ""}
                    onChange={(e) => {
                      const newParams = [...params];
                      newParams[idx].desc = e.target.value;
                      setParams(newParams);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="description"
                  />
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => setParams(params.filter((_, i) => i !== idx))}
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