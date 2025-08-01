import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepButton,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import PreviewIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";

function KafkaMigrationWizard() {
  // Initial form data for all steps.
  const initialFormData = {
    step1: {
      kafkaType:"",
      deployment: "",
      configurations: "",
      topics: "",
      fileCount:0,
      objectives: {
        scalability: false,
        integration: false,
        monitoring: false,
        replication:false,
      
        tieredstorage:false,
        steamsapi:false,
        clusterlinking:false,
        rbac:false,
        logs:false,
        encyption:false,
        ksqldb:false,
        kafkaconnect:false,
        // Tiered Storage
        // Streams API
        // Cluster Linking
        // Role-Based Access Control (RBAC)
        // Audit Logs
        // Encryption & Authentication
        // ksqlDB
        // Kafka Connect
      },
    },
    step2: {
      clusters: "",
      sourceBootstrap: "",
      targetBootstrap: "",
      replicationEnabled: "",
      replicationTopics: "",
      replicationFactor: "",
      networking: false,
    },
    step3: {
      schemaRegistry: "",
      useMirrorMaker: false,
      connectTransformationConfig: `{
  "name": "orders_mirror",
  "config": {
    "connector.class": "org.apache.kafka.connect.mirror.MirrorSourceConnector",
    "tasks.max": "1",
    "source.cluster.alias": "source",
    "target.cluster.alias": "target",
    "topics": "orders",
    "source.cluster.bootstrap.servers": "localhost:9092",
    "target.cluster.bootstrap.servers": "localhost:9093",
    "producer.override.bootstrap.servers": "localhost:9093",
    "offset-syncs.topic.replication.factor": "1",
    "transforms": "schemaTransfer",
    "transforms.schemaTransfer.type": "com.github.oneschema.SchemaRegistryTransferSMT",
    "transforms.schemaTransfer.source.url": "http://source-schema-registry:8081",
    "transforms.schemaTransfer.target.url": "http://target-schema-registry:8081"
  }
}`,
    },
    step4: {
      producers: [],
      consumers: [],
      useRestProxy: false,
      useKafkaConnect: false,
    },
    step5: {
      llmModel: "",
      automatedConfig: false,
      realTimeMonitoring: false,
      documentSupport: false,
    },
  };

  // Component states.
  const [activeStep, setActiveStep] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [previewRecord, setPreviewRecord] = useState(null);
  const [openTransformationDialog, setOpenTransformationDialog] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState("");
  const [openPromptDialog, setOpenPromptDialog] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [migrations, setMigrations] = useState([]);
  // State to hold the record being edited (if any).
  const [editingMigration, setEditingMigration] = useState(null);

  // Load previously saved migrations on mount.
  useEffect(() => {
    const stored = localStorage.getItem("migrations");
    if (stored) {
      setMigrations(JSON.parse(stored));
    }
  }, []);

  // Define step labels.
  const steps = [
    "Evaluate Current Setup",
    "Confluent Cloud Setup",
    "Schema Registry & MirrorMaker",
    "Application Migration",
    "Leveraging GenAI & LLMs",
  ];

  // Navigation functions.
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Open the wizard dialog new.
  const handleDialogOpen = () => {
    setFormData(initialFormData);
    setActiveStep(0);
    setEditingMigration(null);
    setOpenDialog(true);
  };

  // Close the wizard dialog.
  const handleDialogClose = () => setOpenDialog(false);

  // Generic change handler for top-level fields.
  const handleChange = (step, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], [field]: value },
    }));
  };

  // Change handler for nested objects (e.g. objectives in step1).
  const handleNestedChange = (step, nested, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        [nested]: { ...prev[step][nested], [field]: value },
      },
    }));
  };

  // --- Step 4: Handlers for dynamic Producer/Consumer Lists ---
  const addProducer = () => {
    setFormData((prev) => ({
      ...prev,
      step4: {
        ...prev.step4,
        producers: [...prev.step4.producers, { property: "", value: "" }],
      },
    }));
  };

  const addConsumer = () => {
    setFormData((prev) => ({
      ...prev,
      step4: {
        ...prev.step4,
        consumers: [...prev.step4.consumers, { property: "", value: "" }],
      },
    }));
  };

  const handleProducerChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedProducers = [...prev.step4.producers];
      updatedProducers[index] = { ...updatedProducers[index], [field]: value };
      return { ...prev, step4: { ...prev.step4, producers: updatedProducers } };
    });
  };

  const handleConsumerChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedConsumers = [...prev.step4.consumers];
      updatedConsumers[index] = { ...updatedConsumers[index], [field]: value };
      return { ...prev, step4: { ...prev.step4, consumers: updatedConsumers } };
    });
  };

  const handleRemoveProducer = (index) => {
    setFormData((prev) => {
      const updatedProducers = prev.step4.producers.filter((_, idx) => idx !== index);
      return { ...prev, step4: { ...prev.step4, producers: updatedProducers } };
    });
  };

  const handleRemoveConsumer = (index) => {
    setFormData((prev) => {
      const updatedConsumers = prev.step4.consumers.filter((_, idx) => idx !== index);
      return { ...prev, step4: { ...prev.step4, consumers: updatedConsumers } };
    });
  };

  // Open the wizard in edit mode for a given migration.
  const handleEdit = (record) => {
    setFormData({
      step1: { ...record.step1 },
      step2: { ...record.step2 },
      step3: { ...record.step3 },
      step4: { ...record.step4 },
      step5: { ...record.step5 },
    });
    setActiveStep(0);
    setEditingMigration(record);
    setOpenDialog(true);
  };

  const handleFileSelection = (event) => {
    const files = event.target.files;

    setFormData((prev) => ({
      ...prev,
      step1: {
        ...prev.step1,
        fileCount: files.length, // Replace "newFileCount" with the updated value
      },
    }));
    
  };
  // On submit, either update an existing record or add a new one.
  const handleSubmit = () => {
    if (editingMigration) {
      const updatedMigration = {
        ...editingMigration,
        ...formData,
        timestamp: new Date().toLocaleString(),
      };
      const updatedMigrations = migrations.map((m) =>
        m.id === editingMigration.id ? updatedMigration : m
      );
      setMigrations(updatedMigrations);
      localStorage.setItem("migrations", JSON.stringify(updatedMigrations));
      setEditingMigration(null);
    } else {
      const newMigration = {
        id: Date.now(),
        ...formData,
        timestamp: new Date().toLocaleString(),
      };
      const updatedMigrations = [...migrations, newMigration];
      setMigrations(updatedMigrations);
      localStorage.setItem("migrations", JSON.stringify(updatedMigrations));
    }
    setOpenDialog(false);
  };

  // Download the migration record as a JSON file.
  const handleDownload = (migration) => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(migration, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `migration_${migration.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    document.body.removeChild(downloadAnchorNode);
  };

  // Preview a migration record.
  const handlePreview = (record) => {
    setPreviewRecord(record);
    setOpenPreviewDialog(true);
  };

  // Open the Kafka Connect Transformation popup.
  const handleOpenTransformationDialog = (config) => {
    setTransformationConfig(config);
    setOpenTransformationDialog(true);
  };

  // Generate a long prompt string using the migration configuration.
  const generatePromptString = (record) => {
    const { step1, step2, step3, step4, step5 } = record;
    let sentence = "Migration Plan: ";
    sentence += `The ${step1?.kafkaType} Kafka deployment is "${step1.deployment}", configurations are "${step1.configurations}", and topics/data flow is "${step1.topics}". `;
    const objectives = Object.entries(step1.objectives)
      .filter(([, val]) => val)
      .map(([key]) => key)
      .join(", ");
    if (objectives) {
      sentence += `Objectives include ${objectives}. `;
    }
    sentence += `Confluent Cloud Setup: clusters "${step2.clusters}", source cluster "${step2.sourceBootstrap}", target cluster "${step2.targetBootstrap}", replication enabled: "${step2.replicationEnabled}", topics: "${step2.replicationTopics}", replication factor: "${step2.replicationFactor}", networking: ${step2.networking ? "enabled" : "disabled"}. `;
    sentence += `Schema Registry: "${step3.schemaRegistry}", MirrorMaker: ${step3.useMirrorMaker ? "enabled" : "disabled"}. `;
    if (step4.producers.length > 0) {
      const prods = step4.producers.map((p) => `${p.property}=${p.value}`).join("; ");
      sentence += `Producers: [${prods}]. `;
    }
    if (step4.consumers.length > 0) {
      const cons = step4.consumers.map((c) => `${c.property}=${c.value}`).join("; ");
      sentence += `Consumers: [${cons}]. `;
    }
    sentence += `Integration: Rest Proxy ${step4.useRestProxy ? "enabled" : "disabled"}, Kafka Connect ${step4.useKafkaConnect ? "enabled" : "disabled"}. `;
    sentence += `LLM Configuration: selected model "${step5.llmModel}", automated configuration ${step5.automatedConfig ? "enabled" : "disabled"}, real time monitoring ${step5.realTimeMonitoring ? "enabled" : "disabled"}, document support ${step5.documentSupport ? "enabled" : "disabled"}.`;
    return sentence;
  };

  // Handler to generate and display the prompt.
  const handleGeneratePrompt = (record) => {
    const prompt = generatePromptString(record);
    setGeneratedPrompt(prompt);
    setOpenPromptDialog(true);
  };

  // Render content for each step.
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="llm-model-label">Kafka Distribution</InputLabel>
              <Select
                labelId="llm-model-label"
                label="Select LLM Model"
                value={formData.step1?.kafkaType}
                onChange={(e) =>
                  handleChange("step1", "kafkaType", e.target.value)
                }
              >
                <MenuItem value="Azure HDInsight Kafka">Azure HDInsight Kafka</MenuItem>
                <MenuItem value="Apache Kafka">Apache Kafka</MenuItem>
                <MenuItem value="Amazon MSK (Managed Streaming for Apache Kafka)">Amazon MSK (Managed Streaming for Apache Kafka)</MenuItem>
                <MenuItem value="Red Hat AMQ Streams">Red Hat AMQ Streams</MenuItem>
                <MenuItem value="IBM Event Streams">IBM Event Streams</MenuItem>
                <MenuItem value="Cloudera Kafka">Cloudera Kafka</MenuItem>
                <MenuItem value="Aiven Kafka">Aiven Kafka</MenuItem>
                
                 </Select>
            </FormControl><TextField


              fullWidth
              label="Existing Kafka Deployment"
              placeholder="Existing Kafka Deployment"
              value={formData.step1.deployment}
              onChange={(e) => handleChange("step1", "deployment", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Configurations"
              placeholder="Enter configurations details..."
              value={formData.step1.configurations}
              onChange={(e) => handleChange("step1", "configurations", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Topics and Data Flow"
              placeholder="Enter topics and data flow..."
              value={formData.step1.topics}
              onChange={(e) => handleChange("step1", "topics", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

<input
        type="file"
        multiple
        webkitdirectory="true" // Allows folder selection in Chrome-based browsers
        directory="true" // Allows folder selection (for compatibility)
        style={{ display: "none" }}
        id="file-input"
        onChange={handleFileSelection}
      />
      <label htmlFor="file-input">
        <Button variant="contained" component="span">
          Select Files or Folder
        </Button>
      </label>
      {formData.step1.fileCount > 0 && (
        <Typography variant="body1">
          Total files selected: <strong>{formData.step1.fileCount}</strong>
        </Typography>
      )}

            <FormGroup row sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.step1.objectives.scalability}
                    onChange={(e) =>
                      handleNestedChange("step1", "objectives", "scalability", e.target.checked)
                    }
                  />
                }
                label="Improved Scalability"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.step1.objectives.integration}
                    onChange={(e) =>
                      handleNestedChange("step1", "objectives", "integration", e.target.checked)
                    }
                  />
                }
                label="Better Integration"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.step1.objectives.monitoring}
                    onChange={(e) =>
                      handleNestedChange("step1", "objectives", "monitoring", e.target.checked)
                    }
                  />
                }
                label="Enhanced Monitoring"
              />


<FormControlLabel control={ <Checkbox
                    checked={formData.step1.objectives.replication}
                    onChange={(e) =>
                      handleNestedChange("step1", "objectives", "replication", e.target.checked)
                    }/>}
                label="Replication & Fault Tolerance"/>


       
        
       
        <FormControlLabel control={ <Checkbox
                    checked={formData.step1.objectives.tieredstorage}
                    onChange={(e) =>
                      handleNestedChange("step1", "objectives", "tieredstorage", e.target.checked)
                    }/>}
                label="Tiered Storage"/>

        <FormControlLabel control={ <Checkbox
          checked={formData.step1.objectives.steamsapi}
          onChange={(e) =>
            handleNestedChange("step1", "objectives", "steamsapi", e.target.checked)
          }/>}
      label="Streams API"/>

        <FormControlLabel control={ <Checkbox
          checked={formData.step1.objectives.clusterlinking}
          onChange={(e) =>
            handleNestedChange("step1", "objectives", "clusterlinking", e.target.checked)
          }/>}
      label="Cluster Linking"/>

        <FormControlLabel control={ <Checkbox
          checked={formData.step1.objectives.rbac}
          onChange={(e) =>
            handleNestedChange("step1", "objectives", "rbac", e.target.checked)
          }/>}
      label="Role-Based Access Control (RBAC)"/>

        <FormControlLabel control={ <Checkbox
          checked={formData.step1.objectives.logs}
          onChange={(e) =>
            handleNestedChange("step1", "objectives", "logs", e.target.checked)
          }/>}
      label="Audit Logs"/>

        
        <FormControlLabel control={ <Checkbox
          checked={formData.step1.objectives.encyption}
          onChange={(e) =>
            handleNestedChange("step1", "objectives", "encyption", e.target.checked)
          }/>}
      label="Encryption & Authentication"/>

        
        <FormControlLabel control={ <Checkbox
          checked={formData.step1.objectives.ksqldb}
          onChange={(e) =>
            handleNestedChange("step1", "objectives", "ksqldb", e.target.checked)
          }/>}
      label="ksqlDB"/>

        
        <FormControlLabel control={ <Checkbox
          checked={formData.step1.objectives.kafkaconnect}
          onChange={(e) =>
            handleNestedChange("step1", "objectives", "kafkaconnect", e.target.checked)
          }/>}
      label="Kafka Connect"/>

            </FormGroup>
          </Box>
        );
      case 1:
        return (
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>

            
            <TextField
              fullWidth
              label="Define the clusters"
              placeholder="source,target"
              value={formData.step2.clusters}
              onChange={(e) => handleChange("step2", "clusters", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Source cluster configuration"
              placeholder="localhost:9092"
              value={formData.step2.sourceBootstrap}
              onChange={(e) => handleChange("step2", "sourceBootstrap", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Target cluster configuration"
              placeholder="localhost:9093"
              value={formData.step2.targetBootstrap}
              onChange={(e) => handleChange("step2", "targetBootstrap", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Enable replication from source to target"
              placeholder="true"
              value={formData.step2.replicationEnabled}
              onChange={(e) => handleChange("step2", "replicationEnabled", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Replicate topics"
              placeholder="orders|_schemas"
              value={formData.step2.replicationTopics}
              onChange={(e) => handleChange("step2", "replicationTopics", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Replication Factor"
              placeholder="1"
              value={formData.step2.replicationFactor}
              onChange={(e) => handleChange("step2", "replicationFactor", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.step2.networking}
                  onChange={(e) =>
                    handleChange("step2", "networking", e.target.checked)
                  }
                />
              }
              label="Configure Networking: Enable connectivity between existing Kafka and Confluent Cloud"
              sx={{ mt: 2 }}
            />
          </Box>
        );
      case 2:
        return (
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Schema Registry Details"
              placeholder="Enter schema registry details..."
              value={formData.step3.schemaRegistry}
              onChange={(e) => handleChange("step3", "schemaRegistry", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.step3.useMirrorMaker}
                  onChange={(e) =>
                    handleChange("step3", "useMirrorMaker", e.target.checked)
                  }
                />
              }
              label="Use MirrorMaker 2 for replication"
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Kafka Connect Transformation Configuration"
              placeholder="Prepopulated configuration..."
              multiline
              rows={8}
              variant="outlined"
              margin="normal"
              value={formData.step3.connectTransformationConfig}
              onChange={(e) =>
                handleChange("step3", "connectTransformationConfig", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        );
      case 3:
        return (
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Integration Options
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.step4.useRestProxy}
                    onChange={(e) =>
                      handleChange("step4", "useRestProxy", e.target.checked)
                    }
                  />
                }
                label="Enable Rest Proxy"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.step4.useKafkaConnect}
                    onChange={(e) =>
                      handleChange("step4", "useKafkaConnect", e.target.checked)
                    }
                  />
                }
                label="Enable Kafka Connect"
              />
            </Box>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              Producers Configuration
            </Typography>
            {formData.step4.producers.map((prod, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <FormControl sx={{ width: 250, mr: 1 }}>
                  <InputLabel id={`producer-select-${idx}`}>Property</InputLabel>
                  <Select
                    labelId={`producer-select-${idx}`}
                    value={prod.property}
                    label="Property"
                    onChange={(e) =>
                      handleProducerChange(idx, "property", e.target.value)
                    }
                  >
                    <MenuItem value="acks">acks</MenuItem>
                    <MenuItem value="compression.type">compression.type</MenuItem>
                    <MenuItem value="retries">retries</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Value"
                  sx={{ width: 200, mr: 1 }}
                  value={prod.value}
                  onChange={(e) =>
                    handleProducerChange(idx, "value", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <IconButton onClick={() => handleRemoveProducer(idx)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button variant="outlined" onClick={addProducer} sx={{ mt: 1 }}>
              Add Producer
            </Button>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              Consumers Configuration
            </Typography>
            {formData.step4.consumers.map((cons, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <FormControl sx={{ width: 250, mr: 1 }}>
                  <InputLabel id={`consumer-select-${idx}`}>Property</InputLabel>
                  <Select
                    labelId={`consumer-select-${idx}`}
                    value={cons.property}
                    label="Property"
                    onChange={(e) =>
                      handleConsumerChange(idx, "property", e.target.value)
                    }
                  >
                    <MenuItem value="fetch.min.bytes">fetch.min.bytes</MenuItem>
                    <MenuItem value="max.poll.records">max.poll.records</MenuItem>
                    <MenuItem value="auto.offset.reset">auto.offset.reset</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Value"
                  sx={{ width: 200, mr: 1 }}
                  value={cons.value}
                  onChange={(e) =>
                    handleConsumerChange(idx, "value", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <IconButton onClick={() => handleRemoveConsumer(idx)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button variant="outlined" onClick={addConsumer} sx={{ mt: 1 }}>
              Add Consumer
            </Button>
          </Box>
        );
      case 4:
        return (
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="llm-model-label">Select LLM Model</InputLabel>
              <Select
                labelId="llm-model-label"
                label="Select LLM Model"
                value={formData.step5.llmModel}
                onChange={(e) =>
                  handleChange("step5", "llmModel", e.target.value)
                }
              >
                <MenuItem value="Azure OpenAI">Azure OpenAI</MenuItem>
                <MenuItem value="AWS Bedrock">AWS Bedrock</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.step5.automatedConfig}
                    onChange={(e) =>
                      handleChange("step5", "automatedConfig", e.target.checked)
                    }
                  />
                }
                label="Automated configurations"
              />
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.step5.realTimeMonitoring}
                    onChange={(e) =>
                      handleChange("step5", "realTimeMonitoring", e.target.checked)
                    }
                  />
                }
                label="Real time monitoring and optimization"
              />
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.step5.documentSupport}
                    onChange={(e) =>
                      handleChange("step5", "documentSupport", e.target.checked)
                    }
                  />
                }
                label="Document and support"
              />
            </Box>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  // Render rows for the migration history table.
  const renderTableRows = () => {
    return migrations.map((migration) => (
      <TableRow key={migration.id}>
        <TableCell>{migration.id}</TableCell>
        <TableCell>
          <Typography variant="body2">
          
          <strong>Kafka Distributions:</strong> {migration.step1?.kafkaType} <br />
          <strong>File Counts:</strong> {migration.step1.fileCount} <br />

            <strong>Deployment:</strong> {migration.step1.deployment} <br />
            <strong>Configurations:</strong> {migration.step1.configurations} <br />
            <strong>Topics/Data Flow:</strong> {migration.step1.topics} <br />
            <strong>Objectives:</strong>{" "}
            {Object.entries(migration.step1.objectives)
              .filter(([, val]) => val)
              .map(([key]) => key)
              .join(", ")}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            <strong>Clusters:</strong> {migration.step2.clusters} <br />
            <strong>Source Bootstrap:</strong> {migration.step2.sourceBootstrap} <br />
            <strong>Target Bootstrap:</strong> {migration.step2.targetBootstrap} <br />
            <strong>Replication Enabled:</strong> {migration.step2.replicationEnabled} <br />
            <strong>Topics:</strong> {migration.step2.replicationTopics} <br />
            <strong>Replication Factor:</strong> {migration.step2.replicationFactor} <br />
            <strong>Networking:</strong> {migration.step2.networking ? "Yes" : "No"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            <strong>Schema Registry:</strong> {migration.step3.schemaRegistry} <br />
            <strong>MirrorMaker:</strong> {migration.step3.useMirrorMaker ? "Yes" : "No"} <br />
            <strong>Kafka Connect Transformation:</strong>{" "}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleOpenTransformationDialog(
                  migration.step3.connectTransformationConfig
                );
              }}
            >
              Read
            </Link>
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {migration.step4.producers.length > 0 && (
              <>
                <strong>Producers:</strong>{" "}
                {migration.step4.producers
                  .map((p) => `${p.property}=${p.value}`)
                  .join("; ")}{" "}
                <br />
              </>
            )}
            {migration.step4.consumers.length > 0 && (
              <>
                <strong>Consumers:</strong>{" "}
                {migration.step4.consumers
                  .map((c) => `${c.property}=${c.value}`)
                  .join("; ")}
              </>
            )}
            <br />
            <strong>Rest Proxy:</strong> {migration.step4.useRestProxy ? "Yes" : "No"} <br />
            <strong>Kafka Connect:</strong> {migration.step4.useKafkaConnect ? "Yes" : "No"}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            <strong>LLM Model:</strong> {migration.step5.llmModel} <br />
            <strong>Automated Config:</strong> {migration.step5.automatedConfig ? "Yes" : "No"} <br />
            <strong>Real Time Monitoring:</strong> {migration.step5.realTimeMonitoring ? "Yes" : "No"} <br />
            <strong>Document Support:</strong> {migration.step5.documentSupport ? "Yes" : "No"}
          </Typography>
        </TableCell>
        <TableCell>
          <IconButton onClick={() => handleDownload(migration)} title="Download">
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={() => handlePreview(migration)} title="Preview">
            <PreviewIcon />
          </IconButton>
          <IconButton onClick={() => handleEdit(migration)} title="Edit">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleGeneratePrompt(migration)} title="Generate Prompt">
            <DescriptionIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(migration.id)} title="Delete">
            <DeleteIcon />
          </IconButton>
        </TableCell>
        <TableCell>{migration.timestamp}</TableCell>
      </TableRow>
    ));
  };

  // Delete a migration record.
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this migration record?")) {
      const newMigrations = migrations.filter((m) => m.id !== id);
      setMigrations(newMigrations);
      localStorage.setItem("migrations", JSON.stringify(newMigrations));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Migrate from Existing Kafka to Confluent Cloud Kafka
      </Typography>
      <Button variant="contained" color="primary" onClick={handleDialogOpen}>
        Migrate New
      </Button>

      {/* Migration Wizard Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Migration Steps</DialogTitle>
        <DialogContent>
          <Stepper nonLinear activeStep={activeStep} alternativeLabel sx={{ pt: 3, pb: 5 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton onClick={() => setActiveStep(index)}>{label}</StepButton>
              </Step>
            ))}
          </Stepper>
          {getStepContent(activeStep)}
        </DialogContent>
        <DialogActions>
          {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
          {activeStep < steps.length - 1 && (
            <Button onClick={handleNext} variant="contained" color="primary">
              Next
            </Button>
          )}
          {(
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingMigration ? "Save" : "Submit"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Kafka Connect Transformation Popup */}
      <Dialog
        open={openTransformationDialog}
        onClose={() => setOpenTransformationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Kafka Connect Transformation</DialogTitle>
        <DialogContent>
          <Box
            component="pre"
            sx={{
              backgroundColor: "#f5f5f5",
              padding: 2,
              borderRadius: 1,
              overflowX: "auto",
            }}
          >
            {transformationConfig}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTransformationDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Generated Prompt Popup as Multi-line Text Field */}
      <Dialog
        open={openPromptDialog}
        onClose={() => setOpenPromptDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generated Prompt</DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            multiline
            fullWidth
            rows={10}
            value={generatedPrompt}
            InputProps={{ readOnly: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPromptDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={openPreviewDialog}
        onClose={() => setOpenPreviewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Migration Record Preview</DialogTitle>
        <DialogContent>
          {previewRecord ? (
            <Box
              component="pre"
              sx={{
                backgroundColor: "#f5f5f5",
                padding: 2,
                borderRadius: 1,
                overflowX: "auto",
              }}
            >
              {JSON.stringify(previewRecord, null, 2)}
            </Box>
          ) : (
            <Typography>No record selected.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreviewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Migrations History Table */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Migrations History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Step 1: Evaluation</TableCell>
                <TableCell>Step 2: Confluent Cloud Setup</TableCell>
                <TableCell>Step 3: Schema Registry</TableCell>
                <TableCell>Step 4: App Migration</TableCell>
                <TableCell>Step 5: GenAI & LLMs</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Date & Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default KafkaMigrationWizard;
