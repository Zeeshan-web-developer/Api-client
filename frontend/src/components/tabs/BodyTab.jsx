export default function BodyTab({ body, setBody, bodyType, setBodyType, formatJSON }) {
  const bodyTypes = ["none", "json", "form-data", "x-www-form-urlencoded"];
  
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {bodyTypes.map(type => (
          <button
            key={type}
            onClick={() => setBodyType(type)}
            className={`px-4 py-2 text-sm rounded-lg transition font-medium ${
              bodyType === type
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {type === "none" && "None"}
            {type === "json" && "JSON"}
            {type === "form-data" && "Form Data"}
            {type === "x-www-form-urlencoded" && "x-www-form-urlencoded"}
          </button>
        ))}
      </div>
      
      {bodyType === "json" && (
        <div>
          <div className="flex justify-end mb-2">
            <button
              onClick={formatJSON}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 4 4 4h8c2.5 0 4-2 4-4V7c0-2-1.5-4-4-4H8c-2.5 0-4 2-4 4z" />
              </svg>
              Pretty JSON
            </button>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{\n  "name": "usebruno"\n}'
            rows={12}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
          />
        </div>
      )}
      
      {(bodyType === "form-data" || bodyType === "x-www-form-urlencoded") && (
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="key1=value1&key2=value2"
          rows={8}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
        />
      )}
      
      {bodyType === "none" && (
        <div className="text-center py-8 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p>This request has no body</p>
        </div>
      )}
    </div>
  );
}