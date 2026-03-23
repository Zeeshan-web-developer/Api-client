import { useState } from "react";

export const useUIState = () => {
  const [activeTab, setActiveTab] = useState("params");
  const [responseTab, setResponseTab] = useState("body");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showEnvModal, setShowEnvModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("medium");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  
  const openEnvModal = () => setShowEnvModal(true);
  const closeEnvModal = () => setShowEnvModal(false);
  
  const openCollectionModal = () => setShowCollectionModal(true);
  const closeCollectionModal = () => setShowCollectionModal(false);

  const resetUIState = () => {
    setActiveTab("params");
    setResponseTab("body");
    setIsEditing(false);
    setSearchQuery("");
  };

  return {
    // Tabs
    activeTab,
    setActiveTab,
    responseTab,
    setResponseTab,
    
    // Sidebar
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    
    // Modals
    showEnvModal,
    setShowEnvModal,
    showCollectionModal,
    setShowCollectionModal,
    openEnvModal,
    closeEnvModal,
    openCollectionModal,
    closeCollectionModal,
    
    // Collection UI
    newCollectionName,
    setNewCollectionName,
    selectedCollection,
    setSelectedCollection,
    
    // UI State
    isEditing,
    setIsEditing,
    searchQuery,
    setSearchQuery,
    theme,
    setTheme,
    toggleTheme,
    fontSize,
    setFontSize,
    
    // Utilities
    resetUIState
  };
};