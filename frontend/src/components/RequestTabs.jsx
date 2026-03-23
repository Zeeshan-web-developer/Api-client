import ParamsTab from "./tabs/ParamsTab";
import AuthTab from "./tabs/AuthTab";
import HeadersTab from "./tabs/HeadersTab";
import BodyTab from "./tabs/BodyTab";

export default function RequestTabs({ 
  activeTab, 
  setActiveTab, 
  params, 
  setParams, 
  auth, 
  setAuth, 
  headers, 
  setHeaders, 
  body, 
  setBody, 
  bodyType, 
  setBodyType, 
  formatJSON 
}) {
  const tabs = [
    { id: "params", label: "Params", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m3.707-7.586a4 4 0 00-5.656 5.656l4 4a4 4 0 005.656-5.656l-1.102-1.102" },
    { id: "auth", label: "Authorization", icon: "M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V8a4 4 0 00-8 0v3h8z" },
    { id: "headers", label: "Headers", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { id: "body", label: "Body", icon: "M4 7v10c0 2 1.5 4 4 4h8c2.5 0 4-2 4-4V7c0-2-1.5-4-4-4H8c-2.5 0-4 2-4 4z" }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50/50">
        <div className="flex px-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium capitalize transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-orange-600 border-b-2 border-orange-600 bg-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {activeTab === "params" && (
          <ParamsTab params={params} setParams={setParams} />
        )}
        
        {activeTab === "auth" && (
          <AuthTab auth={auth} setAuth={setAuth} />
        )}
        
        {activeTab === "headers" && (
          <HeadersTab headers={headers} setHeaders={setHeaders} />
        )}
        
        {activeTab === "body" && (
          <BodyTab 
            body={body}
            setBody={setBody}
            bodyType={bodyType}
            setBodyType={setBodyType}
            formatJSON={formatJSON}
          />
        )}
      </div>
    </div>
  );
}