export const buildQueryString = (params) => {
  const activeParams = params.filter(p => p.enabled && p.key);
  if (activeParams.length === 0) return "";
  
  return "?" + activeParams
    .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value || "")}`)
    .join("&");
};

export const formatResponseSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const formatTime = (ms) => {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
};

export const getStatusColor = (status) => {
  if (status >= 200 && status < 300) return "bg-emerald-100 text-emerald-700";
  if (status >= 300 && status < 400) return "bg-blue-100 text-blue-700";
  if (status >= 400 && status < 500) return "bg-amber-100 text-amber-700";
  if (status >= 500) return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

export const getMethodColor = (method) => {
  const colors = {
    GET: "bg-emerald-100 text-emerald-700 border-emerald-200",
    POST: "bg-blue-100 text-blue-700 border-blue-200",
    PUT: "bg-amber-100 text-amber-700 border-amber-200",
    PATCH: "bg-purple-100 text-purple-700 border-purple-200",
    DELETE: "bg-red-100 text-red-700 border-red-200",
    HEAD: "bg-gray-100 text-gray-700 border-gray-200",
    OPTIONS: "bg-gray-100 text-gray-700 border-gray-200"
  };
  return colors[method] || "bg-gray-100 text-gray-700 border-gray-200";
};

export const isValidJson = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const escapeHtml = (str) => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};