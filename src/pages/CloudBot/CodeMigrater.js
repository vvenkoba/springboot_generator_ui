import React, { useState, useEffect, useRef } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Box,
  CssBaseline,
  IconButton,
} from "@mui/material";
import PrimarySearchAppBar from "../PrimarySearchAppBar";
import ExpandableText from "./ExplandableText";
import Folder from "../Folder";
import FolderAnalyzer from "./FolderAnalyzer";
import VSCodeView from "./VSCodeView";

const API_BASE = "http://127.0.0.1:8000";

function CodeMigrater() {
  // ================== CRUD States ====================
  const [showPopup, setShowPopup] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [loadingConfigs, setLoadingConfigs] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("create"); // "create" or "edit"
  const [currentConfig, setCurrentConfig] = useState({
    use_case: "",
    model_name: "",
    prompt: "",
    input_language: "",
    output_language: "",
    output_extension: "",
  });

  // ================= Conversion States =================
  // We'll assume only one conversion happens at a time.
  const [selectedConfigForConversion, setSelectedConfigForConversion] = useState(null);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionLoading, setConversionLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch all configuration records
  useEffect(() => {
    fetchConfigs();
  }, []);

  
const theme = createTheme();
  const fetchConfigs = async () => {
    setLoadingConfigs(true);
    try {
      const res = await fetch(`${API_BASE}/configs/`);
      const data = await res.json();
      setConfigs(data);
    } catch (err) {
      console.error("Error fetching configs", err);
    }
    setLoadingConfigs(false);
  };

  // ============== CRUD Dialog Handlers ===============
  const handleAddNew = () => {
    setDialogMode("create");
    setCurrentConfig({
      use_case: "",
      model_name: "",
      prompt: "",
      input_language: "",
      output_language: "",
      output_extension: "",
    });
    setOpenDialog(true);
  };

  const handleEdit = (config) => {
    setDialogMode("edit");
    setCurrentConfig(config);
    setOpenDialog(true);
  };

  const handleDialogSave = async () => {
    if (dialogMode === "create") {
      try {
        const res = await fetch(`${API_BASE}/configs/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentConfig),
        });
        if (res.ok) {
          await fetchConfigs();
          setOpenDialog(false);
        }
      } catch (err) {
        console.error("Error saving config", err);
      }
    } else {
      try {
        const res = await fetch(`${API_BASE}/configs/${currentConfig.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentConfig),
        });
        if (res.ok) {
          await fetchConfigs();
          setOpenDialog(false);
        }
      } catch (err) {
        console.error("Error updating config", err);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/configs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchConfigs();
      }
    } catch (err) {
      console.error("Error deleting config", err);
    }
  };

  const handleDialogFieldChange = (e) => {
    setCurrentConfig({
      ...currentConfig,
      [e.target.name]: e.target.value,
    });
  };

  // ============== Conversion (Upload Action) ===============
  // When "Upload & Convert" is clicked in a row,
  // set the selected config for conversion and trigger the file input.
  const handleOpenConversionForRow = (config) => {
    setSelectedConfigForConversion(config);
    // Reset conversion-related state:
    setConversionProgress(0);
    setConversionLoading(false);
    // Trigger the hidden file input:
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Called immediately after a file is chosen.
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && selectedConfigForConversion) {
      handleConvertFile(file, selectedConfigForConversion);
    }
  };

  // Conversion API call using XMLHttpRequest with progress
  const handleConvertFile = (file, config) => {
    const formData = new FormData();
    formData.append("model_name", config.model_name);
    formData.append("prompt", config.prompt);
    formData.append("input_language", config.input_language);
    formData.append("output_language", config.output_language);
    // Let the backend infer input_extension if not needed:
    formData.append("output_extension", config.output_extension);
    formData.append("source_file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/convert/`, true);
    setConversionLoading(true);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setConversionProgress(percentComplete);
      }
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        setConversionLoading(false);
        // if (xhr.status === 200) {
          // Create a download link for the response blob.
          const blob = new Blob([xhr.response], { type: xhr.getResponseHeader("content-type") });
          let filename = "converted_output";
          const disposition = xhr.getResponseHeader("Content-Disposition");
          if (disposition && disposition.indexOf("filename=") !== -1) {
            const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
            if (filenameMatch && filenameMatch[1]) filename = filenameMatch[1];
          }
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setConversionProgress(0);
        // } else {
        //   alert("Error during file conversion");
        // }
        // Clear selected config after conversion attempt.
        setSelectedConfigForConversion(null);
      }
    };
    xhr.responseType = "blob";
    xhr.send(formData);
  };

  return (

   

    <Container sx={{ my: 4 }}>
 <div style={{ opacity: showPopup ? 0.1 : 1 }}>


      <Typography variant="h4" gutterBottom>
        Models Configuration
      </Typography>
      {/* <Button variant="contained" color="primary" onClick={handleAddNew}>
      New Model
      </Button> */}

      <Button onClick={handleAddNew} 
      class="btn switchTo1Cv3Btn">New Model</Button>

      {loadingConfigs ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading configurations…
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Use Case</TableCell>
                <TableCell>Model Name</TableCell>
                <TableCell>Prompt</TableCell>
                <TableCell>Input Lang</TableCell>
                <TableCell>Output Lang</TableCell>
                <TableCell>Output Ext</TableCell>
                <TableCell align="center">Actions</TableCell>
                <TableCell align="center">Test</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {configs.map((config) => (
                <TableRow key={config.id}>
                  <TableCell>{config.id}</TableCell>
                  <TableCell>{config.use_case}</TableCell>
                  <TableCell>{config.model_name}</TableCell>
                  <TableCell>
                  <ExpandableText text={config.prompt} maxLength={100} />
                  </TableCell>
                  <TableCell>{config.input_language}</TableCell>
                  <TableCell>{config.output_language}</TableCell>
                  <TableCell>{config.output_extension}</TableCell>
                  <TableCell align="center">
                  <IconButton onClick={() => handleEdit(config)} color="primary" size="small">
    <EditIcon />
  </IconButton>
  <IconButton onClick={() => handleDelete(config.id)} color="error" size="small">
    <DeleteIcon />
  </IconButton>
  
                  
                  </TableCell>

                  <TableCell align="center">  {/* Upload & Convert button */}
                  
                    {conversionLoading && selectedConfigForConversion?.id === config.id
                        ? `Converting (${conversionProgress}%)`
                        : <><IconButton  onClick={() => handleOpenConversionForRow(config)} color="success"  size="small">
                       <CloudUploadIcon />
                      </IconButton>
                      
                      <IconButton  onClick={() => setShowPopup(true)} color="success"  size="small">
                       <DriveFolderUploadIcon />
                      </IconButton>
                      </>}


  
  
  

                    {/* Optionally, show a small progress bar in the same cell */}
                    {conversionLoading && selectedConfigForConversion?.id === config.id && (
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress variant="determinate" value={conversionProgress} />
                      </Box>
                    )}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* CRUD Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>
          {dialogMode === "create" ? "New Model" : "Edit Model Config"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Use Case"
            name="use_case"
            value={currentConfig.use_case}
            onChange={handleDialogFieldChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Model Name"
            name="model_name"
            value={currentConfig.model_name}
            onChange={handleDialogFieldChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Prompt"
            multiline
            rows={3} // Adjust number of rows as needed (2 or 3)
            name="prompt"
            value={currentConfig.prompt}
            onChange={handleDialogFieldChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Input Language"
            name="input_language"
            value={currentConfig.input_language}
            onChange={handleDialogFieldChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Output Language"
            name="output_language"
            value={currentConfig.output_language}
            onChange={handleDialogFieldChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Output Extension"
            name="output_extension"
            value={currentConfig.output_extension}
            onChange={handleDialogFieldChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDialogSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden file input used for conversions */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

</div>

{showPopup && (
               <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflowY: "auto" // 👈 Allows vertical scrolling
            }}>
                <div style={{
                    background: "white",
                    width: "80%",
                    height: "80%",
                    padding: "20px",
                    borderRadius: "10px",
                    position: "relative",
                    overflowY: "auto" // 👈 Enables scroll within modal
                }}>
                        <button 
                            onClick={() => setShowPopup(false)}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                fontSize: "20px",
                                border: "none",
                                background: "white",
                                color: "white",
                                padding: "5px 10px",
                                cursor: "pointer",
                                borderRadius: "5px"
                            }}>
                            ❌ Close
                        </button>
                        {/* FolderComponent inside the popup */}
                        <VSCodeView/>
                    </div>
                </div>
            )}

    </Container>


  );
}

export default CodeMigrater;
