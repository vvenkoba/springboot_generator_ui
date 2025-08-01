import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import VisibilityIcon from '@mui/icons-material/Visibility';

const steps = ['Source Details', 'Client & Confluent Details', 'Review & Download'];

// Multi-step migration wizard in a dialog
function KafkaMigrationWizard({ open, onClose, onProjectCreated }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    kafkaBrokerUrl: '',
    sourceApiKey: '',
    sourceSecret: '',
    clientProperties: '',
    confluentUrl: '',
    confluentApiKey: '',
    confluentSecret: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate and move to the next step
  const handleNext = () => {
    setError('');
    if (activeStep === 0) {
      if (!formData.kafkaBrokerUrl || !formData.sourceApiKey || !formData.sourceSecret) {
        setError('Please fill all source details.');
        return;
      }
    } else if (activeStep === 1) {
      if (!formData.clientProperties || !formData.confluentUrl || !formData.confluentApiKey || !formData.confluentSecret) {
        setError('Please fill all client and Confluent Cloud details.');
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  // Go back one step
  const handleBack = () => {
    setError('');
    setActiveStep((prev) => prev - 1);
  };

  // Track field changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Simulate API call for downloading project and persisting in local storage
  const handleDownload = async () => {
    setLoading(true);
    setError('');
    try {
      // Simulate a network delay (replace with a real API call if needed)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Construct a new project object (simulate API response)
      const newProject = {
        id: Date.now(),
        ...formData,
      };

      // Update local storage
      const storedProjects = JSON.parse(localStorage.getItem('kafkaProjects')) || [];
      storedProjects.push(newProject);
      localStorage.setItem('kafkaProjects', JSON.stringify(storedProjects));

      onProjectCreated(newProject);
      setLoading(false);
      onClose();
    } catch (err) {
      setError('Failed to create project. Please try again.');
      setLoading(false);
    }
  };

  // Render step content based on active step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              name="kafkaBrokerUrl"
              label="Kafka Broker URL"
              value={formData.kafkaBrokerUrl}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="sourceApiKey"
              label="API Key"
              value={formData.sourceApiKey}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="sourceSecret"
              label="Secret"
              type="password"
              value={formData.sourceSecret}
              onChange={handleInputChange}
              margin="normal"
            />
          </Box>
        );
      case 1:
        return (
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              name="clientProperties"
              label="Kafka Client Properties"
              value={formData.clientProperties}
              onChange={handleInputChange}
              margin="normal"
              helperText="Enter properties as comma separated key=value pairs"
            />
            <TextField
              fullWidth
              name="confluentUrl"
              label="Confluent Cloud Kafka URL"
              value={formData.confluentUrl}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="confluentApiKey"
              label="Confluent API Key"
              value={formData.confluentApiKey}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="confluentSecret"
              label="Confluent Secret"
              type="password"
              value={formData.confluentSecret}
              onChange={handleInputChange}
              margin="normal"
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Review Details</Typography>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              <strong>Kafka Broker URL:</strong> {formData.kafkaBrokerUrl}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Source API Key:</strong> {formData.sourceApiKey}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Kafka Client Properties:</strong> {formData.clientProperties}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Confluent Cloud Kafka URL:</strong> {formData.confluentUrl}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Confluent API Key:</strong> {formData.confluentApiKey}
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Migrate Kafka Project</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
        {activeStep !== 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 && (
          <Button onClick={handleNext} disabled={loading}>
            Next
          </Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button onClick={handleDownload} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Download & Save Project'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

// Table component to display migrated Kafka projects with actions
function KafkaProjectsTable({ projects, onDelete, onDownload, onPreview }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Project ID</TableCell>
            <TableCell>Kafka Broker URL</TableCell>
            <TableCell>Confluent URL</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.id}</TableCell>
              <TableCell>{project.kafkaBrokerUrl}</TableCell>
              <TableCell>{project.confluentUrl}</TableCell>
              <TableCell>
                <IconButton onClick={() => onPreview(project)} aria-label="preview">
                  <VisibilityIcon />
                </IconButton>
                <IconButton onClick={() => onDownload(project)} aria-label="download">
                  <GetAppIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(project.id)} aria-label="delete" color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No migrated projects found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Main application component combining the migration wizard and projects table
export default function KafkaMigrationApp() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  // Load existing projects from local storage on mount
  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('kafkaProjects')) || [];
    setProjects(storedProjects);
  }, []);

  const handleProjectCreated = (project) => {
    setProjects((prev) => [...prev, project]);
  };

  const handleDelete = (projectId) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    localStorage.setItem('kafkaProjects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  // Simulated actions for download and preview
  const handleDownload = (project) => {
    alert('Downloading project: ' + project.id);
  };

  const handlePreview = (project) => {
    alert('Previewing project:\n' + JSON.stringify(project, null, 2));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Kafka Migration Projects
      </Typography>
      <Button variant="contained" onClick={() => setWizardOpen(true)}>
        Migrate New
      </Button>
      <KafkaProjectsTable
        projects={projects}
        onDelete={handleDelete}
        onDownload={handleDownload}
        onPreview={handlePreview}
      />
      <KafkaMigrationWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </Box>
  );
}
