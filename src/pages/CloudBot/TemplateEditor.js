// TemplateEditor.jsx
import React, { useState } from "react";

const TemplateEditor = ({ template, onBack }) => {
  // Initialize stages from the template with empty file inputs.
  const initialStages = template.stages.map(stage => ({
    ...stage,
    inputFiles: { selectionType: "file", files: [] }
  }));
  const [stages, setStages] = useState(initialStages);

  const handleFileChange = (e, stageIndex) => {
    const files = Array.from(e.target.files);
    const updatedStages = [...stages];
    updatedStages[stageIndex].inputFiles.files = files.map((file, index) => ({
      id: `${file.name}-${index}`,
      name: file.name,
      fileObject: file
    }));
    setStages(updatedStages);
  };

  const handleSelectionTypeChange = (e, stageIndex) => {
    const updatedStages = [...stages];
    updatedStages[stageIndex].inputFiles.selectionType = e.target.value;
    setStages(updatedStages);
  };

  const handleSavePipeline = () => {
    console.log("Final pipeline with new file selections:", stages);
    alert("Pipeline with new file selections saved successfully!");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Template Editor: {template.name}</h2>
      <button
        onClick={onBack}
        style={{
          padding: "8px 15px",
          background: "#ccc",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        Back
      </button>
      {stages.map((stage, index) => (
        <div
          key={stage.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "5px",
            background: "#f9f9f9"
          }}
        >
          <p>
            <strong>Stage {index + 1}</strong>
          </p>
          <p>
            <strong>Objective:</strong> {stage.objective.label}
          </p>
          <p>
            <strong>Platform:</strong> {stage.platform.label}
          </p>
          <p>
            <strong>Model:</strong> {stage.model.label}
          </p>
          <label><strong>File Selection Type:</strong></label>
          <select
            value={stage.inputFiles.selectionType}
            onChange={(e) => handleSelectionTypeChange(e, index)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="file">File</option>
            <option value="folder">Folder</option>
          </select>
          <br />
          <label style={{ marginTop: "10px", display: "block" }}>
            <strong>Input Files:</strong>
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileChange(e, index)}
            style={{ width: "100%", marginTop: "5px" }}
          />
        </div>
      ))}
      <button
        onClick={handleSavePipeline}
        style={{
          padding: "10px 20px",
          background: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Migrate
      </button>
    </div>
  );
};

export default TemplateEditor;
