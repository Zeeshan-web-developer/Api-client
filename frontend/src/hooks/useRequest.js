import { useState } from "react";
import axios from "axios";

export const useRequest = (options = {}) => {
  // Request State
  const [url, setUrl] = useState(options.initialUrl || "https://jsonplaceholder.typicode.com/posts/1");
  const [method, setMethod] = useState(options.initialMethod || "GET");
  const [headers, setHeaders] = useState(options.initialHeaders || [
    { key: "Content-Type", value: "application/json", enabled: true }
  ]);
  const [body, setBody] = useState(options.initialBody || "");
  const [bodyType, setBodyType] = useState(options.initialBodyType || "none");
  const [params, setParams] = useState(options.initialParams || []);
  const [auth, setAuth] = useState(options.initialAuth || { type: "none", data: {} });
  
  // Response State
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper functions
  const buildUrl = (urlValue, paramsValue, activeEnv, environments) => {
    let baseUrl = urlValue;
    if (environments?.[activeEnv]?.baseUrl && urlValue.startsWith("/")) {
      baseUrl = environments[activeEnv].baseUrl + urlValue;
    }
    
    const activeParams = (paramsValue || params).filter(p => p?.enabled && p?.key);
    if (activeParams.length > 0) {
      const queryString = activeParams
        .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value || "")}`)
        .join("&");
      baseUrl += (baseUrl.includes("?") ? "&" : "?") + queryString;
    }
    
    return baseUrl;
  };

  const buildHeaders = (headersValue, authValue) => {
    const activeHeaders = (headersValue || headers)
      .filter(h => h?.enabled && h?.key)
      .reduce((obj, h) => ({ ...obj, [h.key]: h.value }), {});

    // Add auth headers
    const currentAuth = authValue || auth;
    if (currentAuth.type === "bearer" && currentAuth.data?.token) {
      activeHeaders["Authorization"] = `Bearer ${currentAuth.data.token}`;
    } else if (currentAuth.type === "basic" && currentAuth.data?.username && currentAuth.data?.password) {
      const credentials = btoa(`${currentAuth.data.username}:${currentAuth.data.password}`);
      activeHeaders["Authorization"] = `Basic ${credentials}`;
    }

    return activeHeaders;
  };

  const buildBody = (bodyTypeValue, bodyValue) => {
    const currentBodyType = bodyTypeValue || bodyType;
    const currentBody = bodyValue !== undefined ? bodyValue : body;
    
    if (currentBodyType === "json" && currentBody) {
      try {
        return JSON.parse(currentBody);
      } catch (e) {
        return currentBody;
      }
    } else if (currentBodyType === "form-data" || currentBodyType === "x-www-form-urlencoded") {
      return currentBody;
    }
    return null;
  };

  const buildRequestConfig = (configOptions = {}) => {
    const {
      url: customUrl,
      method: customMethod,
      headers: customHeaders,
      body: customBody,
      bodyType: customBodyType,
      params: customParams,
      auth: customAuth,
      activeEnv,
      environments
    } = configOptions;

    const finalUrl = buildUrl(customUrl || url, customParams || params, activeEnv, environments);
    const activeHeaders = buildHeaders(customHeaders || headers, customAuth || auth);
    const requestBody = buildBody(customBodyType || bodyType, customBody !== undefined ? customBody : body);

    return {
      url: finalUrl,
      method: (customMethod || method).toLowerCase(),
      headers: activeHeaders,
      data: requestBody,
      timeout: options.timeout || 30000
    };
  };

  const sendRequest = async (requestConfig) => {
    setLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const config = requestConfig || buildRequestConfig();
      const response = await axios(config);
      const responseTime = Date.now() - startTime;
      
      const responseData = {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        responseTime,
        headers: response.headers,
        size: JSON.stringify(response.data).length,
        config: config
      };
      
      setResponse(responseData);
      
      if (options.onRequestComplete) {
        options.onRequestComplete(responseData);
      }
      
      return responseData;
    } catch (err) {
      const errorData = {
        data: err.response?.data || { error: err.message },
        status: err.response?.status || 500,
        statusText: err.response?.statusText || "Error",
        responseTime: Date.now() - startTime,
        error: err.message,
        config: requestConfig
      };
      
      setResponse(errorData);
      setError(err);
      
      if (options.onRequestError) {
        options.onRequestError(errorData);
      }
      
      return errorData;
    } finally {
      setLoading(false);
    }
  };

  const clearResponse = () => {
    setResponse(null);
    setError(null);
  };

  const resetRequest = () => {
    setUrl(options.initialUrl || "https://jsonplaceholder.typicode.com/posts/1");
    setMethod(options.initialMethod || "GET");
    setHeaders(options.initialHeaders || [{ key: "Content-Type", value: "application/json", enabled: true }]);
    setBody(options.initialBody || "");
    setBodyType(options.initialBodyType || "none");
    setParams(options.initialParams || []);
    setAuth(options.initialAuth || { type: "none", data: {} });
    clearResponse();
  };

  // Header management
  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "", enabled: true }]);
  };

  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  // Parameter management
  const updateParam = (index, field, value) => {
    const newParams = [...params];
    newParams[index][field] = value;
    setParams(newParams);
  };

  const addParam = () => {
    setParams([...params, { key: "", value: "", enabled: true, desc: "" }]);
  };

  const removeParam = (index) => {
    setParams(params.filter((_, i) => i !== index));
  };

  return {
    // Request State
    url, setUrl,
    method, setMethod,
    headers, setHeaders,
    body, setBody,
    bodyType, setBodyType,
    params, setParams,
    auth, setAuth,
    
    // Response State
    response,
    loading,
    error,
    
    // Actions
    sendRequest,
    clearResponse,
    setResponse,
    resetRequest,
    
    // Builder functions
    buildRequestConfig,
    buildUrl,
    buildHeaders,
    buildBody,
    
    // Header management
    updateHeader,
    addHeader,
    removeHeader,
    
    // Parameter management
    updateParam,
    addParam,
    removeParam
  };
};