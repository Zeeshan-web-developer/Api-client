import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useCollections = () => {
  const [collections, setCollections] = useLocalStorage("postman-clone-collections", []);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const createCollection = (name) => {
    if (name && name.trim()) {
      const newCollection = {
        id: Date.now(),
        name: name.trim(),
        requests: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCollections([...collections, newCollection]);
      return newCollection;
    }
    return null;
  };

  const saveToCollection = (collection, requestData) => {
    if (!collection) {
      alert("Please select a collection first");
      return false;
    }

    const updatedCollections = collections.map(col => {
      if (col.id === collection.id) {
        const newRequest = {
          id: Date.now(),
          ...requestData,
          createdAt: new Date().toISOString(),
          headers: JSON.parse(JSON.stringify(requestData.headers)),
          params: JSON.parse(JSON.stringify(requestData.params)),
          auth: JSON.parse(JSON.stringify(requestData.auth))
        };
        return {
          ...col,
          requests: [...col.requests, newRequest],
          updatedAt: new Date().toISOString()
        };
      }
      return col;
    });
    
    setCollections(updatedCollections);
    alert(`✅ Saved to "${collection.name}"!`);
    return true;
  };

  const updateCollection = (collectionId, updates) => {
    const updatedCollections = collections.map(col => {
      if (col.id === collectionId) {
        return { ...col, ...updates, updatedAt: new Date().toISOString() };
      }
      return col;
    });
    setCollections(updatedCollections);
  };

  const deleteCollection = (collectionId) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      setCollections(collections.filter(col => col.id !== collectionId));
    }
  };

  const deleteRequestFromCollection = (collectionId, requestId) => {
    const updatedCollections = collections.map(col => {
      if (col.id === collectionId) {
        return {
          ...col,
          requests: col.requests.filter(req => req.id !== requestId),
          updatedAt: new Date().toISOString()
        };
      }
      return col;
    });
    setCollections(updatedCollections);
  };

  const loadRequest = (requestData, setters) => {
    setters.setUrl(requestData.url);
    setters.setMethod(requestData.method);
    setters.setHeaders(requestData.headers || [{ key: "Content-Type", value: "application/json", enabled: true }]);
    setters.setBody(requestData.body || "");
    setters.setBodyType(requestData.bodyType || "none");
    setters.setParams(requestData.params || []);
    setters.setAuth(requestData.auth || { type: "none", data: {} });
  };

  return {
    collections,
    setCollections,
    selectedCollection,
    setSelectedCollection,
    createCollection,
    saveToCollection,
    updateCollection,
    deleteCollection,
    deleteRequestFromCollection,
    loadRequest
  };
};