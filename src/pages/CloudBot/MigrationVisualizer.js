import React, { useState } from 'react';
import {
  Container,
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import Editor from '@monaco-editor/react';

const MigrationVisualizer = () => {
  const [file, setFile] = useState(null);
  const [migrationResult, setMigrationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSRS, setShowSRS] = useState(false);
  const [showFRD, setShowFRD] = useState(false);
  const [editedCode, setEditedCode] = useState('');

  // Expecting a .zip file now.
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload your zipped Struts 2 project folder.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:8002/migrate_full/", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Migration API request failed");
      }
      const data = await response.json();
      setMigrationResult(data);
      // Initialize the editor with the migrated Spring Boot code.
      const springBootCode =
        data.Migration.OptimizedCode.optimized_code ||
        data.Migration.TranslatedCode.translated_code ||
        "";
      setEditedCode(springBootCode);
    } catch (error) {
      console.error("Error during migration:", error);
      alert(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  // Download the current (edited) Spring Boot code as a text file.
  const handleDownload = () => {
    const element = document.createElement("a");
    const fileBlob = new Blob([editedCode], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = "SpringBootProject.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Code Migration Dashboard
        </Typography>
        <Box component="form" onSubmit={handleSubmit} textAlign="center" mb={4}>
          <Button variant="contained" component="label">
            Upload Zipped Struts 2 Project Folder
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".zip"
            />
          </Button>
          &nbsp;
          <Button variant="contained" type="submit" color="primary">
            Migrate Project
          </Button>
        </Box>
      </Box>

      <Box my={4}>
        {loading && (
          <Box textAlign="center">
            <CircularProgress />
            <Typography variant="subtitle1">Processing migration...</Typography>
          </Box>
        )}

        {migrationResult && (
          <Grid container spacing={2}>
            {/* Migration Pipeline Details */}
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Context Analysis
                  </Typography>
                  <Typography variant="body2">
                    {migrationResult.Migration.ContextAnalysis.context}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Code Analysis
                  </Typography>
                  <Typography variant="body2">
                    {migrationResult.Migration.CodeAnalysis.code_analysis}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Internal Documentation
                  </Typography>
                  <Typography variant="body2">
                    {migrationResult.Migration.InternalDocumentation.internal_documentation}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Documentation Section: Buttons to Open Modals */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ cursor: "pointer" }} onClick={() => setShowSRS(true)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    View SRS Document
                  </Typography>
                  <Typography variant="body2">
                    Click to view the AI-generated Software Requirements Specification.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ cursor: "pointer" }} onClick={() => setShowFRD(true)}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    View FRD Document
                  </Typography>
                  <Typography variant="body2">
                    Click to view the AI-generated Functional Requirements Document.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Flow Diagram Display (from Base64) */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Flow Diagram
                  </Typography>
                  {migrationResult.Documentation.FlowDiagram.flow_diagram ? (
                    <Box mt={2} display="flex" justifyContent="center">
                      <img
                        src={`data:image/png;base64,${migrationResult.Documentation.FlowDiagram.flow_diagram}`}
                        alt="Flow Diagram"
                        style={{ width: "100%", maxWidth: 600 }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2">Flow diagram generation failed.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Code Editor for Migrated Spring Boot Code */}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Migrated Spring Boot Code
                  </Typography>
                  <Editor
                    height="400px"
                    language="java"
                    theme="vs-dark"
                    value={editedCode}
                    onChange={(value) => setEditedCode(value)}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                    }}
                  />
                  <Box mt={2} textAlign="right">
                    <Button variant="contained" color="success" onClick={handleDownload}>
                      Download Project
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* SRS Document Modal */}
      <Dialog open={showSRS} onClose={() => setShowSRS(false)} maxWidth="md" fullWidth>
        <DialogTitle>SRS Document</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">
            {migrationResult && migrationResult.Documentation.SRS.SRS_Document}
          </Typography>
        </DialogContent>
      </Dialog>

      {/* FRD Document Modal */}
      <Dialog open={showFRD} onClose={() => setShowFRD(false)} maxWidth="md" fullWidth>
        <DialogTitle>FRD Document</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">
            {migrationResult && migrationResult.Documentation.FRD.FRD_Document}
          </Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MigrationVisualizer;
