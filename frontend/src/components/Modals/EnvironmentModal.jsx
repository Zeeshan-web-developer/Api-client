import { useState } from "react";
import Modal from "./Modal";

export default function EnvironmentModal({ 
  showEnvModal, 
  setShowEnvModal, 
  environments, 
  updateEnvironment 
}) {
  const [newEnvName, setNewEnvName] = useState("");
  const [showAddEnv, setShowAddEnv] = useState(false);
  console.log("Environments in Modal:", environments);

  const handleAddEnvironment = () => {
    if (newEnvName && !environments[newEnvName]) {
      updateEnvironment(newEnvName, "baseUrl", "");
      updateEnvironment(newEnvName, "name", newEnvName);
      updateEnvironment(newEnvName, "variables", {});
      setNewEnvName("");
      setShowAddEnv(false);
    }
  };

  return (
    <Modal
      isOpen={showEnvModal}
      onClose={() => setShowEnvModal(false)}
      title="Environment Variables"
    >
      <div className="space-y-4">
        {Object.entries(environments).map(([envName, envData]) => (
          <div key={envName} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800 capitalize">{envData.name || envName}</h4>
              {envName !== "development" && (
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${envName} environment?`)) {
                      const newEnvironments = { ...environments };
                      delete newEnvironments[envName];
                      // This would need to be handled by parent
                    }
                  }}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Base URL</label>
                <input
                  type="text"
                  placeholder="https://api.example.com"
                  value={envData.baseUrl || ""}
                  onChange={(e) => updateEnvironment(envName, "baseUrl", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                />
              </div>
              
              {envData.variables?.length && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Variables ({{variable}})</label>
                  <textarea
                    placeholder='{\n  "apiKey": "your-key",\n  "userId": "123"\n}'
                    value={JSON.stringify(envData.variables, null, 2)}
                    onChange={(e) => {
                      try {
                        const variables = JSON.parse(e.target.value);
                        updateEnvironment(envName, "variables", variables);
                      } catch (err) {
                        // Invalid JSON, ignore
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                    rows={4}
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {showAddEnv ? (
          <div className="border border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="text"
              value={newEnvName}
              onChange={(e) => setNewEnvName(e.target.value)}
              placeholder="Environment name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddEnvironment}
                className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddEnv(false)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddEnv(true)}
            className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-orange-500 hover:text-orange-500 transition"
          >
            + Add Environment
          </button>
        )}
      </div>
    </Modal>
  );
}