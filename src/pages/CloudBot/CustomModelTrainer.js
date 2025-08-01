import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import { baseModelProviders,baseModelMapping } from "./PipelineData";
// Predefined options for technologies and providers.
const legacyTechOptions = ["AngularJS","Tibco", "PHP", "Ruby", "Webmethods"];
const modernTechOptions = ["ReactJS","Angular","JavaScript", "TypeScript", "Go", "AWS Lambda","Java"];


function CustomModelTrainer() {
  // State for Upload Form (multiple files allowed)
  const [legacyTech, setLegacyTech] = useState("");
  const [modernTech, setModernTech] = useState("");
  const [baseModelProvider, setBaseModelProvider] = useState("");
  const [baseModel, setBaseModel] = useState("");
  const [legacyFiles, setLegacyFiles] = useState([]);
  const [modernFiles, setModernFiles] = useState([]);

  // State for Test Form (multiple files allowed)
  const [selectedTestModelId, setSelectedTestModelId] = useState("");
  const [testLegacyFiles, setTestLegacyFiles] = useState([]);
  const [modernCode, setModernCode] = useState("");

  // Global states for Custom Models and Logs
  const [models, setModels] = useState([]);
  const [selectedLogs, setSelectedLogs] = useState("");
  const [showLogs, setShowLogs] = useState(false);

  // Dialog visibility states
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);

  // Loading and action messages
  const [uploading, setUploading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  // Fetch models from the backend.
  const fetchModels = async () => {
    try {
      const res = await axios.get("http://localhost:8001/models");
      setModels(res.data.models);
    } catch (error) {
      console.error("Failed to fetch models", error);
    }
  };

  useEffect(() => {
    fetchModels();
    const interval = setInterval(fetchModels, 100000);
    return () => clearInterval(interval);
  }, []);

  // Handle file selections.
  const handleLegacyFolderUpload = (e) => {
    const files = Array.from(e.target.files);
    setLegacyFiles(files);
  };

  const handleModernFolderUpload = (e) => {
    const files = Array.from(e.target.files);
    setModernFiles(files);
  };

  const handleTestLegacyUpload = (e) => {
    const files = Array.from(e.target.files);
    setTestLegacyFiles(files);
  };

  // Reset the base model when provider changes.
  const handleProviderChange = (e) => {
    setBaseModelProvider(e.target.value);
    setBaseModel("");
  };

  // Handle the Upload form submission.
  const handleUpload = async () => {
    if (
      !legacyTech ||
      !modernTech ||
      !baseModelProvider ||
      !baseModel ||
      legacyFiles.length === 0 ||
      modernFiles.length === 0
    ) {
      alert("All fields are required!");
      return;
    }
    setUploading(true);
    setActionMsg("Uploading model data...");
    const formData = new FormData();
    formData.append("legacy_technology", legacyTech);
    formData.append("modern_technology", modernTech);
    formData.append("base_model_provider", baseModelProvider);
    formData.append("base_model", baseModel);

    legacyFiles.forEach((file) =>
      formData.append("legacy_folder", file)
    );
    modernFiles.forEach((file) =>
      formData.append("modern_folder", file)
    );

    try {
      const res = await axios.post("http://localhost:8001/upload_model", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload successful, Model ID: " + res.data.id);
      fetchModels();
      setShowUploadDialog(false);
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }
    setUploading(false);
    setActionMsg("");
  };

  // Handle the Test form submission.
  const handleTestModel = async () => {
    if (!selectedTestModelId || testLegacyFiles.length === 0) {
      alert("Select a test model and at least one legacy test file.");
      return;
    }
    const formData = new FormData();
    testLegacyFiles.forEach((file) =>
      formData.append("legacy_file", file)
    );
    try {
      const res = await axios.post(
        `http://localhost:8001/test_model/${selectedTestModelId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setModernCode(res.data.modern_code);
    } catch (error) {
      console.error("Test failed", error);
      alert("Test failed.");
    }
  };

  // Handle viewing logs.
  const handleViewLogs = async (modelId) => {
    try {
      const res = await axios.get(`http://localhost:8001/logs/${modelId}`);
      setSelectedLogs(res.data.logs);
      setShowLogs(true);
    } catch (error) {
      console.error("Unable to fetch logs", error);
      alert("Unable to fetch logs.");
    }
  };

  // Handle training, retraining, aborting, and deleting.
  const handleTrain = async (modelId) => {
    try {
      await axios.post(`http://localhost:8001/train/${modelId}`);
      alert("Training initiated for model " + modelId);
      fetchModels();
    } catch (error) {
      console.error("Training failed", error);
      alert("Training failed.");
    }
  };

  const handleRetrain = async (modelId) => {
    try {
      await axios.post(`http://localhost:8001/retrain/${modelId}`);
      alert("Retraining initiated for model " + modelId);
      fetchModels();
    } catch (error) {
      console.error("Retraining failed", error);
      alert("Retraining failed.");
    }
  };

  const handleAbort = async (modelId) => {
    try {
      await axios.post(`http://localhost:8001/abort/${modelId}`);
      alert("Abort signal sent for model " + modelId);
      fetchModels();
    } catch (error) {
      console.error("Abort failed", error);
      alert("Abort failed.");
    }
  };

  const handleDelete = async (modelId) => {
    if (!window.confirm(`Are you sure you want to delete model ${modelId}?`)) {
      return;
    }
    try {
      await axios.delete(`http://localhost:8001/models/${modelId}`);
      alert("Model deleted successfully");
      fetchModels();
    } catch (error) {
      console.error("Deletion failed", error);
      alert("Delete failed.");
    }
  };

  const availableBaseModels = baseModelProvider ? baseModelMapping[baseModelProvider] : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Custom Model Trainer
      </Typography>
      
      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={() => setShowUploadDialog(true)}>
          Upload Custom Model Data
        </Button>
        <Button variant="contained" onClick={() => setShowTestDialog(true)}>
          Test Custom Model
        </Button>
      </Box>
      
      {/* Upload Dialog */}
      <Dialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Upload Custom Model Data</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <FormControl fullWidth>
              <InputLabel id="legacy-tech-label">Legacy Technology</InputLabel>
              <Select
                labelId="legacy-tech-label"
                label="Legacy Technology"
                value={legacyTech}
                onChange={(e) => setLegacyTech(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {legacyTechOptions.map((tech) => (
                  <MenuItem key={tech} value={tech}>
                    {tech}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" component="label">
              Upload Legacy Project Files
              <input type="file" multiple hidden onChange={handleLegacyFolderUpload} />
            </Button>
            {legacyFiles.length > 0 && (
              <Typography variant="body2">
                {legacyFiles.length} file(s) selected.
              </Typography>
            )}

            <FormControl fullWidth>
              <InputLabel id="modern-tech-label">Modern Technology</InputLabel>
              <Select
                labelId="modern-tech-label"
                label="Modern Technology"
                value={modernTech}
                onChange={(e) => setModernTech(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {modernTechOptions.map((tech) => (
                  <MenuItem key={tech} value={tech}>
                    {tech}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" component="label">
              Upload Modern Project Files
              <input type="file" multiple hidden onChange={handleModernFolderUpload} />
            </Button>
            {modernFiles.length > 0 && (
              <Typography variant="body2">
                {modernFiles.length} file(s) selected.
              </Typography>
            )}

            <FormControl fullWidth>
              <InputLabel id="base-provider-label">
                Base Model Provider
              </InputLabel>
              <Select
                labelId="base-provider-label"
                label="Base Model Provider"
                value={baseModelProvider}
                onChange={handleProviderChange}
              >
                <MenuItem value="">
                  <em>Select Provider</em>
                </MenuItem>
                {baseModelProviders.map((provider) => (
                  <MenuItem key={provider} value={provider}>
                    {provider}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!baseModelProvider}>
              <InputLabel id="base-model-label">Base Model</InputLabel>
              <Select
                labelId="base-model-label"
                label="Base Model"
                value={baseModel}
                onChange={(e) => setBaseModel(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select Base Model</em>
                </MenuItem>
                {availableBaseModels.map((modelOption) => (
                  <MenuItem key={modelOption} value={modelOption}>
                    {modelOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload & Save"}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Test Dialog */}
      <Dialog
        open={showTestDialog}
        onClose={() => setShowTestDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Test Custom Model</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <FormControl fullWidth>
              <InputLabel id="test-model-label">Select Model</InputLabel>
              <Select
                labelId="test-model-label"
                label="Select Model"
                value={selectedTestModelId}
                onChange={(e) => setSelectedTestModelId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                {models.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {`ID:${model.id} | ${model.legacy_technology} → ${model.modern_technology} (${model.status})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" component="label">
              Upload Legacy Test Files
              <input type="file" multiple hidden onChange={handleTestLegacyUpload} />
            </Button>
            {testLegacyFiles.length > 0 && (
              <Typography variant="body2">
                {testLegacyFiles.length} file(s) selected.
              </Typography>
            )}

            {modernCode && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Generated Modern Code:
                </Typography>
                <Box component="pre" sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                  {modernCode}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTestDialog(false)}>Cancel</Button>
          <Button onClick={handleTestModel} variant="contained">
            Test Model
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Custom Model List Table */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Custom Model List
        </Typography>
        <Button variant="outlined" onClick={fetchModels} sx={{ mb: 2 }}>
          Refresh Models
        </Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="custom model table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Legacy Tech</TableCell>
                <TableCell>Modern Tech</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Base Model</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>{model.id}</TableCell>
                  <TableCell>{model.legacy_technology}</TableCell>
                  <TableCell>{model.modern_technology}</TableCell>
                  <TableCell>{model.base_model_provider}</TableCell>
                  <TableCell>{model.base_model}</TableCell>
                  <TableCell>{model.status}</TableCell>
                  <TableCell>{model.created_at}</TableCell>
                  <TableCell>
                    <Button variant="text" onClick={() => handleViewLogs(model.id)}>
                      View Logs
                    </Button>
                    {model.status === "Training" && (
                      <Button variant="text" color="error" onClick={() => handleAbort(model.id)}>
                        Abort
                      </Button>
                    )}
                    <Button variant="text" onClick={() => handleRetrain(model.id)}>
                      Retrain
                    </Button>
                    {model.status === "Uploaded" && (
                      <Button variant="text" color="primary" onClick={() => handleTrain(model.id)}>
                        Train
                      </Button>
                    )}
                    <Button variant="text" color="error" onClick={() => handleDelete(model.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      {/* Logs Dialog */}
      <Dialog
        open={showLogs}
        onClose={() => setShowLogs(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Training Logs</DialogTitle>
        <DialogContent>
          <Box component="pre" sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
            {selectedLogs}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogs(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomModelTrainer;
