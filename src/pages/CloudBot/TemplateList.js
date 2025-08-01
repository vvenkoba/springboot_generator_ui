// TemplateList.jsx
import React, { useState, useEffect } from "react";

const TemplateList = ({ search, remove, onEditTemplate }) => {
  const [templates, setTemplates] = useState([]);

  // Load templates from local storage on mount.
  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem("pipelineTemplates") || "[]");
    setTemplates(savedTemplates);
  }, []);

  const removeTemplate = (templateId) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem("pipelineTemplates", JSON.stringify(updatedTemplates));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Saved Pipeline Templates</h2>
      {templates.length === 0 ? (
        <p>No saved templates found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {templates.filter(template => template?.name?.toLowerCase()?.includes(search?.toLowerCase() || ""))
            .map((template, index) => (
              <li
                key={template.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                  background: "#f5f5f5",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <strong>{template.name}</strong>
                  <br />
                  <small>Saved on: {new Date(template.timestamp).toLocaleString()}</small>
                </div>
                <div>
                  <button
                    onClick={() => onEditTemplate(template)}
                    style={{
                      padding: "8px 12px",
                      background: "#007BFF",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "10px"
                    }}
                  >
                    Apply
                  </button>
                  {remove && <button
                    onClick={() => removeTemplate(template.id)}
                    style={{
                      padding: "8px 12px",
                      background: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Remove
                  </button>}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default TemplateList;
