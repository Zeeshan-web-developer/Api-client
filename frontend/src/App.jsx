import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import RequestBar from "./components/RequestBar";
import RequestTabs from "./components/RequestTabs";
import ResponseViewer from "./components/ResponseViewer";
import EnvironmentModal from "./components/Modals/EnvironmentModal";
import CollectionModal from "./components/Modals/CollectionModal";
import { useRequest } from "./hooks/useRequest";
import { useCollections } from "./hooks/useCollections";
import { useEnvironments } from "./hooks/useEnvironments";
import { useHistory } from "./hooks/useHistory";
import { useUIState } from "./hooks/useUIState";

export default function App() {
  // Custom hooks for different concerns
  const { 
    url, setUrl, 
    method, setMethod, 
    headers, setHeaders,
    body, setBody,
    bodyType, setBodyType,
    params, setParams,
    auth, setAuth,
    buildRequestConfig,
    resetRequest
  } = useRequest();

  const { 
    response, loading, sendRequest, 
    clearResponse, setResponse 
  } = useRequest({ 
    onRequestComplete: (responseData) => {
      addToHistory(responseData);
    }
  });

  const { 
    collections, setCollections,
    createCollection,
    saveToCollection,
    loadRequest
  } = useCollections();

  const { 
    environments, setEnvironments,
    activeEnv, setActiveEnv,
    updateEnvironment
  } = useEnvironments();

  const { 
    requestHistory, addToHistory, clearHistory 
  } = useHistory();

  const {
    activeTab, setActiveTab,
    responseTab, setResponseTab,
    sidebarOpen, setSidebarOpen,
    showEnvModal, setShowEnvModal,
    showCollectionModal, setShowCollectionModal,
    newCollectionName, setNewCollectionName,
    selectedCollection, setSelectedCollection
  } = useUIState();

  // Wrapper for send request with current state
  const handleSendRequest = async () => {
    const requestConfig = buildRequestConfig(url, method, headers, body, bodyType, params, auth, activeEnv, environments);
    await sendRequest(requestConfig);
  };

  // Handle collection save
  const handleSaveToCollection = () => {
    const requestData = {
      name: url.split("/").pop() || "New Request",
      method,
      url,
      headers,
      body,
      bodyType,
      params,
      auth
    };
    saveToCollection(selectedCollection, requestData);
  };

  // Handle load request from collection/history
  const handleLoadRequest = (requestData) => {
    loadRequest(requestData, {
      setUrl,
      setMethod,
      setHeaders,
      setBody,
      setBodyType,
      setParams,
      setAuth
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-['Inter',system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      <Header
        activeEnv={activeEnv}
        environments={environments}
        setActiveEnv={setActiveEnv}
        setShowEnvModal={setShowEnvModal}
        setShowCollectionModal={setShowCollectionModal}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          collections={collections}
          requestHistory={requestHistory}
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
          loadRequest={handleLoadRequest}
          setShowCollectionModal={setShowCollectionModal}
        />

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-full p-6">
            <RequestBar
              method={method}
              setMethod={setMethod}
              url={url}
              setUrl={setUrl}
              loading={loading}
              sendRequest={handleSendRequest}
              selectedCollection={selectedCollection}
              saveToCollection={handleSaveToCollection}
              getMethodColor={getMethodColor}
            />

            <RequestTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              params={params}
              setParams={setParams}
              auth={auth}
              setAuth={setAuth}
              headers={headers}
              setHeaders={setHeaders}
              body={body}
              setBody={setBody}
              bodyType={bodyType}
              setBodyType={setBodyType}
              formatJSON={() => {
                try {
                  const formatted = JSON.stringify(JSON.parse(body), null, 2);
                  setBody(formatted);
                } catch (e) {
                  alert("Invalid JSON format");
                }
              }}
            />

            <ResponseViewer
              loading={loading}
              response={response}
              responseTab={responseTab}
              setResponseTab={setResponseTab}
            />
          </div>
        </div>
      </div>

      <EnvironmentModal
        showEnvModal={showEnvModal}
        setShowEnvModal={setShowEnvModal}
        environments={environments}
        updateEnvironment={updateEnvironment}
      />

      <CollectionModal
        showCollectionModal={showCollectionModal}
        setShowCollectionModal={setShowCollectionModal}
        newCollectionName={newCollectionName}
        setNewCollectionName={setNewCollectionName}
        createCollection={createCollection}
      />
    </div>
  );
}

// Helper function
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