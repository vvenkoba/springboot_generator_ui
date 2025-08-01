import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

// Options for multi-select dropdowns.
const dependencyOptions = ["requests", "boto3", "pandas", "numpy", "scipy"];
const monitoringOptions = ["CloudWatch", "X-Ray", "Datadog", "NewRelic"];

const totalSteps = 5;

function MigrationWizard() {
  // Current step index: 0 to 4.
  const [currentStep, setCurrentStep] = useState(0);
  // For loading delay when transitioning.
  const [loading, setLoading] = useState(false);

  // Stage 1: Source (TIBCO) Inputs.
  const [stage1, setStage1] = useState({
    transformationLogic: "",
    connectionEndpoints: "",
    fileFormats: "",
    // Must have at least one file.
    processFiles: [],
  });
  // Stage 2: Target (AWS Lambda Python) Requirements.
  const [stage2, setStage2] = useState({
    eventSchema: "",
    envVariables: "",
    // Changed from text field to multi-select array.
    dependencies: [],
    runtimeConfigs: "",
  });
  // Stage 3: Deployment Strategies.
  const [stage3, setStage3] = useState({
    deploymentStrategy: "",
    iamRoles: "",
    // Changed to multi-select.
    monitoringSetups: [],
  });

  // Stage 4 is the final review page.
  // Stage 5: Success page.
  const [modernCode, setModernCode] = useState("");  // For success page, dummy logic.

  // File stage for test inputs (if needed)
  const [selectedTestModelId, setSelectedTestModelId] = useState("");
  const [testLegacyFiles, setTestLegacyFiles] = useState([]);

  // Dummy download handler (creates a dummy file).
  const handleDownload = () => {
    const data = "Migration Package Contents (dummy content)";
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "migration_package.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate progress in percentage.
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  // Simulate a loading delay when moving steps.
  const handleNext = () => {
    if (currentStep === 0 && stage1.processFiles.length === 0) {
      alert("Please upload at least one TIBCO process file.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
      setLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
      setLoading(false);
    }, 1000);
  };

  // Render the form for each stage.
  const renderStage = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    switch (currentStep) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">
              Source (TIBCO) Inputs (Required: TIBCO Process Files)
            </Typography>
            <TextField
              label="Transformation Logic"
              placeholder="Enter transformation details..."
              multiline
              value={stage1.transformationLogic}
              onChange={(e) =>
                setStage1({ ...stage1, transformationLogic: e.target.value })
              }
            />
            <TextField
              label="Connection Endpoints"
              placeholder="List endpoints..."
              value={stage1.connectionEndpoints}
              onChange={(e) =>
                setStage1({ ...stage1, connectionEndpoints: e.target.value })
              }
            />
            <TextField
              label="File/Message Formats"
              placeholder="e.g., XML, JSON, CSV"
              value={stage1.fileFormats}
              onChange={(e) =>
                setStage1({ ...stage1, fileFormats: e.target.value })
              }
            />
            <Button variant="outlined" component="label">
              Upload Process File(s) *
              <input
                type="file"
                hidden
                multiple
                onChange={(e) =>
                  setStage1({
                    ...stage1,
                    processFiles: Array.from(e.target.files),
                  })
                }
              />
            </Button>
            {stage1.processFiles.length > 0 && (
              <Typography variant="body2">
                {stage1.processFiles.length} file(s) selected.
              </Typography>
            )}
          </Box>
        );
      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">
              Target (AWS Lambda Python) Requirements
            </Typography>
            <TextField
              label="Expected Event Schema"
              placeholder="Describe the event schema..."
              multiline
              value={stage2.eventSchema}
              onChange={(e) =>
                setStage2({ ...stage2, eventSchema: e.target.value })
              }
            />
            <TextField
              label="Environment Variable Needs"
              placeholder="List required environment variables..."
              value={stage2.envVariables}
              onChange={(e) =>
                setStage2({ ...stage2, envVariables: e.target.value })
              }
            />
            {/* Multi-select for dependencies */}
            <FormControl fullWidth>
              <InputLabel id="dependencies-label">Dependencies</InputLabel>
              <Select
                labelId="dependencies-label"
                label="Dependencies"
                multiple
                value={stage2.dependencies}
                onChange={(e) =>
                  setStage2({ ...stage2, dependencies: e.target.value })
                }
                renderValue={(selected) => selected.join(", ")}
              >
                {dependencyOptions.map((dep) => (
                  <MenuItem key={dep} value={dep}>
                    {dep}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Runtime Configurations"
              placeholder="e.g., timeout, memory, etc."
              value={stage2.runtimeConfigs}
              onChange={(e) =>
                setStage2({ ...stage2, runtimeConfigs: e.target.value })
              }
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Deployment Strategies</Typography>
            <FormControl fullWidth>
              <InputLabel id="deployment-strategy-label">Deployment Strategy</InputLabel>
              <Select
                labelId="deployment-strategy-label"
                label="Deployment Strategy"
                value={stage3.deploymentStrategy}
                onChange={(e) =>
                  setStage3({ ...stage3, deploymentStrategy: e.target.value })
                }
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="AWS SAM">AWS SAM</MenuItem>
                <MenuItem value="Serverless Framework">Serverless Framework</MenuItem>
                <MenuItem value="CloudFormation">CloudFormation</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="IAM Roles"
              placeholder="Enter IAM role details..."
              value={stage3.iamRoles}
              onChange={(e) =>
                setStage3({ ...stage3, iamRoles: e.target.value })
              }
            />
            {/* Multi-select for monitoring setups */}
            <FormControl fullWidth>
              <InputLabel id="monitoring-label">Monitoring Setups</InputLabel>
              <Select
                labelId="monitoring-label"
                label="Monitoring Setups"
                multiple
                value={stage3.monitoringSetups}
                onChange={(e) =>
                  setStage3({ ...stage3, monitoringSetups: e.target.value })
                }
                renderValue={(selected) => selected.join(", ")}
              >
                {monitoringOptions.map((mon) => (
                  <MenuItem key={mon} value={mon}>
                    {mon}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6">Final Review</Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              {`Stage 1 - Source (TIBCO):
Transformation Logic: ${stage1.transformationLogic || "Not provided"}
Connection Endpoints: ${stage1.connectionEndpoints || "Not provided"}
File/Message Formats: ${stage1.fileFormats || "Not provided"}
Process Files: ${stage1.processFiles.length} file(s) selected.

Stage 2 - Target (AWS Lambda Python):
Event Schema: ${stage2.eventSchema || "Not provided"}
Env Variables: ${stage2.envVariables || "Not provided"}
Dependencies: ${stage2.dependencies.length > 0 ? stage2.dependencies.join(", ") : "Not provided"}
Runtime Configs: ${stage2.runtimeConfigs || "Not provided"}

Stage 3 - Deployment:
Deployment Strategy: ${stage3.deploymentStrategy || "Not provided"}
IAM Roles: ${stage3.iamRoles || "Not provided"}
Monitoring Setups: ${stage3.monitoringSetups.length > 0 ? stage3.monitoringSetups.join(", ") : "Not provided"}`}
            </Typography>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ textAlign: "center", p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Project Migrated Successfully!
            </Typography>
            <Button variant="contained" onClick={handleDownload}>
              Download Migration Package
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      {/* Progress display */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          Progress: {progressPercent}% completed
        </Typography>
        <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 10, borderRadius: 5 }} />
      </Box>

      {/* Stage content */}
      <Box sx={{ p: 3, border: "1px solid #ddd", borderRadius: 1 }}>
        {renderStage()}
      </Box>

      {/* Navigation buttons */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        {currentStep > 0 && (
          <Button variant="outlined" onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        {currentStep < totalSteps - 1 && (
          <Button variant="contained" onClick={handleNext} disabled={loading}>
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
}

export default MigrationWizard;
