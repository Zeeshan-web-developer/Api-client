import { useState } from "react";

export const useRequestState = () => {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState([
    { key: "Content-Type", value: "application/json", enabled: true }
  ]);
  const [body, setBody] = useState("");
  const [bodyType, setBodyType] = useState("none");
  const [params, setParams] = useState([]);
  const [auth, setAuth] = useState({ type: "none", data: {} });

  const resetRequest = () => {
    setUrl("https://jsonplaceholder.typicode.com/posts/1");
    setMethod("GET");
    setHeaders([{ key: "Content-Type", value: "application/json", enabled: true }]);
    setBody("");
    setBodyType("none");
    setParams([]);
    setAuth({ type: "none", data: {} });
  };

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
    // State
    url, setUrl,
    method, setMethod,
    headers, setHeaders,
    body, setBody,
    bodyType, setBodyType,
    params, setParams,
    auth, setAuth,
    
    // Actions
    resetRequest,
    updateHeader,
    addHeader,
    removeHeader,
    updateParam,
    addParam,
    removeParam
  };
};