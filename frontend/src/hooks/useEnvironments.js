import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

const DEFAULT_ENVIRONMENTS = {
  development: { 
    baseUrl: "https://jsonplaceholder.typicode.com",
    name: "Development",
    variables: {}
  },
  staging: { 
    baseUrl: "https://staging-api.example.com",
    name: "Staging",
    variables: {}
  },
  production: { 
    baseUrl: "https://api.example.com",
    name: "Production",
    variables: {}
  }
};

export const useEnvironments = () => {
  const [environments, setEnvironments] = useLocalStorage("postman-clone-environments", DEFAULT_ENVIRONMENTS);
  const [activeEnv, setActiveEnv] = useState("development");

  const updateEnvironment = (envName, key, value) => {
    setEnvironments(prev => ({
      ...prev,
      [envName]: { ...prev[envName], [key]: value }
    }));
  };

  const addEnvironment = (name, config = {}) => {
    if (environments[name]) {
      alert("Environment already exists");
      return false;
    }
    setEnvironments(prev => ({
      ...prev,
      [name]: { baseUrl: "", name: name, variables: {}, ...config }
    }));
    return true;
  };

  const deleteEnvironment = (envName) => {
    if (envName === "development") {
      alert("Cannot delete default development environment");
      return false;
    }
    const newEnvironments = { ...environments };
    delete newEnvironments[envName];
    setEnvironments(newEnvironments);
    if (activeEnv === envName) {
      setActiveEnv("development");
    }
    return true;
  };

  const getCurrentEnvironment = () => {
    return environments[activeEnv] || environments.development;
  };

  const interpolateVariables = (str, envName = activeEnv) => {
    const env = environments[envName];
    if (!env || !env.variables) return str;
    
    return str.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return env.variables[varName] || match;
    });
  };

  return {
    environments,
    setEnvironments,
    activeEnv,
    setActiveEnv,
    updateEnvironment,
    addEnvironment,
    deleteEnvironment,
    getCurrentEnvironment,
    interpolateVariables
  };
};