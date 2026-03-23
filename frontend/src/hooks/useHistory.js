import { useLocalStorage } from "./useLocalStorage";

export const useHistory = (maxItems = 50) => {
  const [requestHistory, setRequestHistory] = useLocalStorage("postman-clone-history", []);

  const generateHistoryId = (request) => {
    // Create a unique ID based on request properties
    const { url, method, headers, body } = request;
    const headersStr = JSON.stringify(headers || {});
    const bodyStr = JSON.stringify(body || {});
    return `${method}-${url}-${headersStr}-${bodyStr}`;
  };

  const addToHistory = (responseData) => {
    if (!responseData?.config) return;

    const historyItem = {
      id: Date.now(),
      uniqueId: generateHistoryId(responseData.config),
      timestamp: new Date().toISOString(),
      request: {
        url: responseData.config.url,
        method: responseData.config.method?.toUpperCase(),
        headers: responseData.config.headers,
        body: responseData.config.data,
        bodyType: responseData.config.bodyType
      },
      response: {
        status: responseData.status,
        statusText: responseData.statusText,
        responseTime: responseData.responseTime,
        size: responseData.size
      }
    };
    
    // Check if we already have a similar request in history
    const existingIndex = requestHistory.findIndex(
      item => item.uniqueId === historyItem.uniqueId
    );
    
    let newHistory;
    if (existingIndex !== -1) {
      // Update existing entry with new timestamp and move to top
      newHistory = [
        historyItem,
        ...requestHistory.filter((_, index) => index !== existingIndex)
      ];
    } else {
      // Add new entry at the top
      newHistory = [historyItem, ...requestHistory];
    }
    
    // Limit history size
    setRequestHistory(newHistory.slice(0, maxItems));
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setRequestHistory([]);
    }
  };

  const deleteHistoryItem = (id) => {
    setRequestHistory(prev => prev.filter(item => item.id !== id));
  };

  const getHistoryItem = (id) => {
    return requestHistory.find(item => item.id === id);
  };

  const searchHistory = (query) => {
    if (!query) return requestHistory;
    
    const lowerQuery = query.toLowerCase();
    return requestHistory.filter(item => 
      item.request.url.toLowerCase().includes(lowerQuery) ||
      item.request.method.toLowerCase().includes(lowerQuery) ||
      item.response.status?.toString().includes(lowerQuery)
    );
  };

  const getRecentHistory = (limit = 10) => {
    return requestHistory.slice(0, limit);
  };

  const getHistoryByMethod = (method) => {
    return requestHistory.filter(item => 
      item.request.method?.toUpperCase() === method.toUpperCase()
    );
  };

  const getHistoryByStatus = (statusCode) => {
    const statusGroup = Math.floor(statusCode / 100);
    return requestHistory.filter(item => 
      Math.floor(item.response.status / 100) === statusGroup
    );
  };

  const clearHistoryByMethod = (method) => {
    if (window.confirm(`Clear all ${method} requests from history?`)) {
      setRequestHistory(prev => 
        prev.filter(item => item.request.method?.toUpperCase() !== method.toUpperCase())
      );
    }
  };

  const clearHistoryByStatus = (statusCode) => {
    const statusGroup = Math.floor(statusCode / 100);
    if (window.confirm(`Clear all ${statusGroup}xx status requests from history?`)) {
      setRequestHistory(prev => 
        prev.filter(item => Math.floor(item.response.status / 100) !== statusGroup)
      );
    }
  };

  const getHistoryStats = () => {
    const stats = {
      total: requestHistory.length,
      byMethod: {},
      byStatus: {},
      averageResponseTime: 0,
      mostUsedEndpoint: null
    };
    
    const endpointCount = {};
    let totalTime = 0;
    
    requestHistory.forEach(item => {
      // Count by method
      const method = item.request.method;
      stats.byMethod[method] = (stats.byMethod[method] || 0) + 1;
      
      // Count by status group
      const statusGroup = Math.floor(item.response.status / 100);
      const statusKey = `${statusGroup}xx`;
      stats.byStatus[statusKey] = (stats.byStatus[statusKey] || 0) + 1;
      
      // Track endpoint usage
      const endpoint = item.request.url.split('?')[0];
      endpointCount[endpoint] = (endpointCount[endpoint] || 0) + 1;
      
      // Sum response times
      totalTime += item.response.responseTime || 0;
    });
    
    // Calculate average response time
    if (requestHistory.length > 0) {
      stats.averageResponseTime = Math.round(totalTime / requestHistory.length);
    }
    
    // Find most used endpoint
    let maxCount = 0;
    for (const [endpoint, count] of Object.entries(endpointCount)) {
      if (count > maxCount) {
        maxCount = count;
        stats.mostUsedEndpoint = endpoint;
      }
    }
    
    return stats;
  };

  return {
    requestHistory,
    setRequestHistory,
    addToHistory,
    clearHistory,
    deleteHistoryItem,
    getHistoryItem,
    searchHistory,
    getRecentHistory,
    getHistoryByMethod,
    getHistoryByStatus,
    clearHistoryByMethod,
    clearHistoryByStatus,
    getHistoryStats
  };
};