export default function AuthTab({ auth, setAuth }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-6 border-b border-gray-200 pb-4">
        {[
          { id: "none", label: "No Auth" },
          { id: "bearer", label: "Bearer Token" },
          { id: "basic", label: "Basic Auth" }
        ].map(type => (
          <label key={type.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={auth.type === type.id}
              onChange={() => setAuth({ type: type.id, data: {} })}
              className="w-4 h-4 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">{type.label}</span>
          </label>
        ))}
      </div>
      
      {auth.type === "bearer" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Token</label>
          <input
            type="text"
            value={auth.data.token || ""}
            onChange={(e) => setAuth({ ...auth, data: { token: e.target.value } })}
            placeholder="Enter your token"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
          />
        </div>
      )}
      
      {auth.type === "basic" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={auth.data.username || ""}
              onChange={(e) => setAuth({ ...auth, data: { ...auth.data, username: e.target.value } })}
              placeholder="Username"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={auth.data.password || ""}
              onChange={(e) => setAuth({ ...auth, data: { ...auth.data, password: e.target.value } })}
              placeholder="Password"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}