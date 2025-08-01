// PipelineBuilder.jsx
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import Modal from "react-modal";
import {pipelineOptions,fileSelectionMapping,legacyFiles,modernFiles} from './PipelineData';
// For accessibility: ensure your root element has id "root"
Modal.setAppElement("#root");

// CodeReviewModal component showing side-by-side comparison.
const CodeReviewModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const legacyFileNames = Object.keys(legacyFiles);

  useEffect(() => {
    if (!selectedFile && legacyFileNames.length > 0) {
      setSelectedFile(legacyFileNames[0]);
    }
  }, [legacyFileNames, selectedFile]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Code Review"
      style={{ content: { width: "80%", height: "80%", margin: "auto" } }}
    >
      <div style={{ display: "flex", height: "100%" }}>
        {/* File list panel */}
        <div style={{ width: "20%", borderRight: "1px solid #ccc", padding: "10px", overflowY: "auto" }}>
          <h3>Files</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {legacyFileNames.map((name) => (
              <li
                key={name}
                style={{
                  padding: "5px",
                  cursor: "pointer",
                  background: selectedFile === name ? "#e0e0e0" : "transparent",
                }}
                onClick={() => setSelectedFile(name)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>

        {/* Legacy code panel */}
        <div style={{ width: "40%", padding: "10px", borderRight: "1px solid #ccc", overflowY: "auto" }}>
          <h3>Legacy Code</h3>
          <pre style={{ background: "#f5f5f5", padding: "10px" }}>
            {legacyFiles[selectedFile] || "No legacy code available"}
          </pre>
        </div>

        {/* Modern code panel */}
        <div style={{ width: "40%", padding: "10px", overflowY: "auto" }}>
          <h3>Modern Code</h3>
          <pre style={{ background: "#f5f5f5", padding: "10px" }}>
            {modernFiles[selectedFile] || "Migration under progress..."}
          </pre>
        </div>
      </div>
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <button
          onClick={onClose}
          style={{ padding: "8px 15px", background: "#ccc", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

const PipelineBuilder = () => {
  // States for adding new stages.
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pipeline, setPipeline] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileSelectionType, setFileSelectionType] = useState("file");

  // Pipeline data from localStorage.
  const [pipelineData, setPipelineData] = useState([]);
  const [activeActionRow, setActiveActionRow] = useState(null);

  // For additional files upload.
  const fileUploadRef = useRef(null);
  const [activeFileUploadPipelineId, setActiveFileUploadPipelineId] = useState(null);

  // For code review modal.
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("pipelineData") || "[]");
    setPipelineData(storedData);
  }, []);

  // --- Modal functions for stage creation ---
  const openModal = () => {
    setSelectedObjective(null);
    setSelectedPlatform(null);
    setSelectedModel(null);
    setSelectedFiles([]);
    setFileSelectionType("file");
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleObjectiveChange = (option) => {
    console.log(option);
    setSelectedObjective(option);
    setSelectedPlatform(null);
    setSelectedModel(null);
    console.log("option.value"+option.label)
    console.log("option.value"+fileSelectionMapping[option.label])
    const allowedTypes = fileSelectionMapping[option.label] || ["file", "folder"];
    setFileSelectionType(allowedTypes[0]);
  };

  const handleSaveStage = () => {
    if (!selectedObjective || !selectedPlatform || !selectedModel) {
      alert("Please complete selection for objective, platform, and model.");
      return;
    }
    const newStage = {
      id: `stage-${pipeline.length + 1}`,
      objective: selectedObjective,
      platform: selectedPlatform,
      model: selectedModel,
      inputFiles: {
        selectionType: fileSelectionType,
        files: selectedFiles.map((file, index) => ({
          id: `${file.name}-${index}`,
          name: file.name,
          fileObject: file,
        })),
      },
    };
    setPipeline([...pipeline, newStage]);
    closeModal();
  };

  const removeStage = (stageId) => {
    const updatedPipeline = pipeline.filter((stage) => stage.id !== stageId);
    setPipeline(updatedPipeline);
  };

  // --- Save Pipeline ---
  const handleSavePipeline = () => {
    if (pipeline.length === 0) {
      alert("No agents available in pipeline builder to save.");
      return;
    }
    const pipelineName = prompt("Enter a name for this pipeline:");
    if (!pipelineName || pipelineName.trim() === "") {
      alert("Pipeline name is required!");
      return;
    }
    const totalFiles = pipeline.reduce(
      (acc, stage) => acc + (stage.inputFiles.files ? stage.inputFiles.files.length : 0),
      0
    );
    const newPipelineData = {
      id: `pipeline-${Date.now()}`,
      name: pipelineName,
      stages: pipeline,
      totalFiles,
      migratedFiles: 0,
      status: "running",
      errors: "",
      timestamp: new Date().toISOString(),
    };
    const updatedData = [...pipelineData, newPipelineData];
    setPipelineData(updatedData);
    localStorage.setItem("pipelineData", JSON.stringify(updatedData));
    setPipeline([]);
    alert("Pipeline saved successfully.");
  };

  // --- Table Action Handlers ---
  const handleAbortPipeline = (pipelineId) => {
    const updated = pipelineData.map((p) =>
      p.id === pipelineId ? { ...p, status: "aborted" } : p
    );
    setPipelineData(updated);
    localStorage.setItem("pipelineData", JSON.stringify(updated));
  };

  // "Add Files" action using a hidden file input.
  const triggerFileUpload = (pipelineId) => {
    setActiveFileUploadPipelineId(pipelineId);
    if (fileUploadRef.current) {
      fileUploadRef.current.click();
    }
  };

  const handleFileUploadChange = (e) => {
    const files = e.target.files;
    if (!activeFileUploadPipelineId || !files) return;
    const additionalCount = files.length;
    const updated = pipelineData.map((p) =>
      p.id === activeFileUploadPipelineId
        ? { ...p, totalFiles: p.totalFiles + additionalCount }
        : p
    );
    setPipelineData(updated);
    localStorage.setItem("pipelineData", JSON.stringify(updated));
    alert(`Added ${additionalCount} file(s) to the pipeline.`);
    setActiveFileUploadPipelineId(null);
    e.target.value = "";
  };

  const handleRemovePipeline = (pipelineId) => {
    if (window.confirm("Are you sure you want to remove this pipeline?")) {
      const updated = pipelineData.filter((p) => p.id !== pipelineId);
      setPipelineData(updated);
      localStorage.setItem("pipelineData", JSON.stringify(updated));
    }
  };

  const handleRerunPipeline = (pipelineId) => {
    const updated = pipelineData.map((p) =>
      p.id === pipelineId ? { ...p, migratedFiles: 0, status: "running", errors: "" } : p
    );
    setPipelineData(updated);
    localStorage.setItem("pipelineData", JSON.stringify(updated));
  };

  const handleSaveAsTemplate = (pipelineId) => {
    const pipelineItem = pipelineData.find((p) => p.id === pipelineId);
    if (!pipelineItem) return;
    const templateStages = pipelineItem.stages.map((stage) => ({
      id: stage.id,
      objective: stage.objective,
      platform: stage.platform,
      model: stage.model,
    }));
    const templateName = prompt("Enter a name for the template:");
    if (!templateName || templateName.trim() === "") {
      alert("Template name is required!");
      return;
    }
    const newTemplate = {
      id: `template-${Date.now()}`,
      name: templateName,
      stages: templateStages,
      timestamp: new Date().toISOString(),
    };
    const savedTemplates = JSON.parse(localStorage.getItem("pipelineTemplates") || "[]");
    savedTemplates.push(newTemplate);
    localStorage.setItem("pipelineTemplates", JSON.stringify(savedTemplates));
    alert("Pipeline saved as template successfully!");
  };

  // Additional actions.
  const handleValidateAndTest = (pipelineId) => {
    alert(`Validating and testing pipeline ${pipelineId}...`);
  };

  const handleReview = (pipelineId) => {
    // For simplicity, when review is clicked, simply open the code review modal.
    setReviewModalOpen(true);
  };

  const handleLogs = (pipelineId) => {
    alert(`Showing logs for pipeline ${pipelineId}...`);
  };

  // --- Derived Options for Dependent Dropdowns ---
  const objectiveOptions = pipelineOptions.objectives;
  const platformOptions = selectedObjective ? selectedObjective.platforms : [];
  const modelOptions = selectedPlatform ? selectedPlatform.models : [];
  const allowedFileOptions =
    selectedObjective && fileSelectionMapping[selectedObjective.label]
      ? fileSelectionMapping[selectedObjective.label]
      : ["file", "folder"];

  const menuButtonStyle = {
    background: "none",
    border: "none",
    padding: "8px 12px",
    textAlign: "left",
    width: "100%",
    cursor: "pointer",
  };

  const toggleActionRow = (pipelineId) => {
    setActiveActionRow(activeActionRow === pipelineId ? null : pipelineId);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Pipeline Builder (Multi Agent)</h1>

      {/* Hidden file input for "Add Files" action */}
      <input
        type="file"
        multiple
        ref={fileUploadRef}
        onChange={handleFileUploadChange}
        style={{ display: "none" }}
      />

      {/* Button to add a new stage */}
      <button
        onClick={openModal}
        style={{
          padding: "10px 20px",
          margin: "10px 0",
          background: "#007BFF",
          border: "none",
          color: "#fff",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        + New Stage
      </button>

      {/* Modal for adding a new stage (width: 600px) */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Pipeline Stage"
        style={{
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height:"500px",
            padding: "20px",
          },
        }}
      >
        <h2>Add New Stage</h2>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <strong>Objective:</strong>
          </label>
          <Select
            options={objectiveOptions}
            value={selectedObjective}
            onChange={handleObjectiveChange}
            placeholder="Select Objective..."
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <strong>Platform:</strong>
          </label>
          <Select
            options={platformOptions}
            value={selectedPlatform}
            onChange={(option) => {
              setSelectedPlatform(option);
              setSelectedModel(null);
            }}
            placeholder="Select Platform..."
            isDisabled={!selectedObjective}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <strong>Model:</strong>
          </label>
          <Select
            options={modelOptions}
            value={selectedModel}
            onChange={setSelectedModel}
            placeholder="Select Model..."
            isDisabled={!selectedPlatform}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <strong>File Selection Type:</strong>
          </label>
          <select
            value={fileSelectionType}
            onChange={(e) => setFileSelectionType(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            {allowedFileOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <strong>Input Files:</strong>
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ width: "100%", marginTop: "5px" }}
          />
        </div>
        <div style={{ textAlign: "right" }}>
          <button
            onClick={closeModal}
            style={{
              padding: "8px 15px",
              marginRight: "10px",
              background: "#ccc",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveStage}
            style={{
              padding: "8px 15px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save Stage
          </button>
        </div>
      </Modal>

      {/* Display current pipeline stages */}
      <div style={{ marginTop: "30px" }}>
        <h2>Current Pipeline Agents (Builder)</h2>
        {pipeline.length === 0 ? (
          <p>No agents added yet.</p>
        ) : (
          pipeline.map((stage, index) => (
            <div
              key={stage.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "5px",
                marginBottom: "10px",
                background: "#f9f9f9",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "-20px",
                  top: "20px",
                  background: "#007BFF",
                  color: "#fff",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {index + 1}
              </div>
              <p>
                <strong>Objective:</strong> {stage.objective.label}
              </p>
              <p>
                <strong>Platform:</strong> {stage.platform.label}
              </p>
              <p>
                <strong>Model:</strong> {stage.model.label}
              </p>
              <p>
                <strong>Files:</strong>{" "}
                {stage.inputFiles.files.map((f) => f.name).join(", ")}
              </p>
              <button
                onClick={() => removeStage(stage.id)}
                style={{
                  padding: "5px 10px",
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Remove Stage
              </button>
            </div>
          ))
        )}
      </div>

      {/* Button to save the entire pipeline */}
      {pipeline.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={handleSavePipeline}
            style={{
              padding: "10px 20px",
              background: "#17a2b8",
              border: "none",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save Pipeline
          </button>
        </div>
      )}

      {/* Table displaying existing pipelines */}
      <div style={{ marginTop: "40px" }}>
        <h2>Existing Pipelines</h2>
        {pipelineData.length === 0 ? (
          <p>No pipelines saved.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "Arial",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Pipeline ID</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Pipeline Name</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Agents</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Timestamp</th>
                <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>Status</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Files</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Migrated Files</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Migrated %</th>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>Errors</th>
                <th style={{ border: "1px solid #ccc", padding: "8px", position: "relative" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pipelineData.map((p) => {
                const migratedPercentage =
                  p.totalFiles > 0 ? ((p.migratedFiles / p.totalFiles) * 100).toFixed(1) : 0;
                return (
                  <tr key={p.id}>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{p.id}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{p.name}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{p.stages.length}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                      {new Date(p.timestamp).toLocaleString()}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                      {p.status === "running" ? (
                        <span title="Running" style={{ fontSize: "20px", color: "green" }}>
                          🟢
                        </span>
                      ) : (
                        <span title="Aborted" style={{ fontSize: "20px", color: "red" }}>
                          🔴
                        </span>
                      )}
                    </td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{p.totalFiles}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{p.migratedFiles}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{migratedPercentage}%</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px" }}>{p.errors || "-"}</td>
                    <td style={{ border: "1px solid #ccc", padding: "8px", position: "relative" }}>
                      {/* Three-dots button triggers the action menu */}
                      <div onClick={() => toggleActionRow(p.id)} style={{ cursor: "pointer", display: "inline-block" }}>
                        ⋮
                      </div>
                      {activeActionRow === p.id && (
                        <div
                          style={{
                            position: "absolute",
                            top: "25px",
                            right: "0",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            zIndex: 2,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {p.status === "running" ? (
                            <button
                              onClick={() => {
                                handleAbortPipeline(p.id);
                                toggleActionRow(null);
                              }}
                              style={menuButtonStyle}
                            >
                              Abort
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                handleRerunPipeline(p.id);
                                toggleActionRow(null);
                              }}
                              style={menuButtonStyle}
                            >
                              Rerun
                            </button>
                          )}
                          <button
                            onClick={() => {
                              triggerFileUpload(p.id);
                              toggleActionRow(null);
                            }}
                            style={menuButtonStyle}
                          >
                            Add Files
                          </button>
                          <button
                            onClick={() => {
                              handleRemovePipeline(p.id);
                              toggleActionRow(null);
                            }}
                            style={menuButtonStyle}
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => {
                              handleValidateAndTest(p.id);
                              toggleActionRow(null);
                            }}
                            style={menuButtonStyle}
                          >
                            Validate & Test
                          </button>
                          <button
                            onClick={() => {
                              handleReview(p.id);
                              toggleActionRow(null);
                            }}
                            style={menuButtonStyle}
                          >
                            Review
                          </button>
                          <button
                            onClick={() => {
                              handleLogs(p.id);
                              toggleActionRow(null);
                            }}
                            style={menuButtonStyle}
                          >
                            Logs
                          </button>
                          <button
                            onClick={() => {
                              handleSaveAsTemplate(p.id);
                              toggleActionRow(null);
                            }}
                            style={menuButtonStyle}
                          >
                            Save as Template
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Code Review Modal */}
      {reviewModalOpen && (
        <CodeReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} />
      )}
    </div>
  );
};

export default PipelineBuilder;
