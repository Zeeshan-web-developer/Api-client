import { useState } from "react";
import Modal from "./Modal";

export default function CollectionModal({ 
  showCollectionModal, 
  setShowCollectionModal, 
  newCollectionName, 
  setNewCollectionName, 
  createCollection 
}) {
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      createCollection(newCollectionName);
      setDescription("");
    }
  };

  return (
    <Modal
      isOpen={showCollectionModal}
      onClose={() => setShowCollectionModal(false)}
      title="Create New Collection"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Collection Name *
            </label>
            <input
              type="text"
              placeholder="My API Collection"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              autoFocus
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              placeholder="What does this collection do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">
              Collections help you organize your API requests. You can save requests to collections for later use.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setShowCollectionModal(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
          >
            Create Collection
          </button>
        </div>
      </form>
    </Modal>
  );
}