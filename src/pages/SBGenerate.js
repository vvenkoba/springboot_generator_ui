import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Grid, Card, CardContent,
  MenuItem, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  Collapse, Snackbar, Alert, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Add, Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';
const fieldTypes = ['string', 'long', 'int', 'double', 'boolean', 'date', 'float', 'datetime'];

export default function SBGenerate() {

  const [projects, setProjects] = useState([]);
  const [formOpen, setFormOpen] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [classes, setClasses] = useState([{ name: '', fields: [{ name: '', type: '' }] }]);
  const [relationships, setRelationships] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  // useEffect(() => {
  //   loadProjects();
  // }, []);

  const handleGenerate = async (id) => {
    try {
      await axios.post(`${API_BASE}/generate/${id}`);
      showSnackbar('Project generated', 'success');
    } catch {
      showSnackbar('Generation failed', 'error');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post(`${API_BASE}/generate-schema`, { prompt });
      const schema = JSON.parse(response.data.schema);
      setClasses(schema.classes || []);
      setRelationships(schema.relationships || []);
    } catch (error) {
      console.error('Error generating schema:', error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const loadProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE}/project/`);
      setProjects(res.data);
      window.location.href = "/projectmanager";
    } catch {
      showSnackbar('Failed to load projects', 'error');
    }
  };

  const resetForm = () => {
    setPrompt('');
    setClasses([{ name: '', fields: [{ name: '', type: '' }] }]);
    setRelationships([]);
    setEditingId(null);
    setFormOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const data = { prompt, classes, relationships };
      if (editingId) {
        await axios.put(`${API_BASE}/project/${editingId}`, data);
        showSnackbar('Project updated', 'success');
      } else {
        await axios.post(`${API_BASE}/project/`, data);
        showSnackbar('Project created', 'success');
      }
      loadProjects();
      resetForm();
    } catch {
      showSnackbar('Save failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/project/${id}`);
      showSnackbar('Project deleted', 'info');
      loadProjects();
    } catch {
      showSnackbar('Delete failed', 'error');
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const handleEdit = (proj) => {
    setPrompt(proj.prompt || '');
    setClasses(proj.classes || [{ name: '', fields: [{ name: '', type: '' }] }]);
    setRelationships(proj.relationships || []);
    setEditingId(proj.id);
    setFormOpen(true);
  };

  const updateClass = (index, key, value) => {
    const updated = [...classes];
    updated[index][key] = value;
    setClasses(updated);
  };

  const updateField = (ci, fi, key, value) => {
    const updated = [...classes];
    updated[ci].fields[fi][key] = value;
    setClasses(updated);
  };

  const updateRelationship = (index, key, value) => {
    const updated = [...relationships];
    updated[index][key] = value;
    setRelationships(updated);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setFormOpen(!formOpen)}
        sx={{ mb: 2 }}
      >
        {formOpen ? 'Cancel' : editingId ? 'Edit Project' : 'New Project'}
      </Button>
      <Button sx={{ ml: 2 }} onClick={resetForm}>Clear</Button>

      <Collapse in={formOpen}>
        <Box border="1px solid #ccc" borderRadius={2} p={2} mb={4}>
          {/* <TextField
            label="Prompt"
            fullWidth
            multiline
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 3 }}
          /> */}

          <TextField
            label="Project Objective"
            fullWidth
            multiline
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} edge="end" aria-label="generate schema">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {classes.map((cls, ci) => (
            <Box key={ci} mb={2}>
              <TextField
                label="Class Name"
                fullWidth
                value={cls.name}
                onChange={(e) => updateClass(ci, 'name', e.target.value)}
                sx={{ mb: 1 }}
              />
              {cls.fields.map((field, fi) => (
                <Grid container spacing={2} key={fi} sx={{ mb: 1 }}>
                  <Grid item xs={6}>
                    <TextField
                      label="Field Name"
                      fullWidth
                      value={field.name}
                      onChange={(e) => updateField(ci, fi, 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Type"
                      select
                      fullWidth
                      value={field.type}
                      onChange={(e) => updateField(ci, fi, 'type', e.target.value)}
                    >
                      {fieldTypes.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              ))}
              <Button onClick={() => {
                const newClasses = [...classes];
                newClasses[ci].fields.push({ name: '', type: '' });
                setClasses(newClasses);
              }}>
                Add Field
              </Button>
            </Box>
          ))}
          <Button onClick={() => setClasses([...classes, { name: '', fields: [{ name: '', type: '' }] }])}>
            Add Class
          </Button>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Relationships</Typography>
          {relationships.map((rel, ri) => (
            <Grid container spacing={2} key={ri} sx={{ mb: 2 }}>
              <Grid item xs={4}>
                <TextField
                  label="From"
                  value={rel.from_class}
                  onChange={(e) => updateRelationship(ri, 'from_class', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="To"
                  value={rel.to_class}
                  onChange={(e) => updateRelationship(ri, 'to_class', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  select
                  label="Relation Type"
                  value={rel.relation_type}
                  onChange={(e) => updateRelationship(ri, 'relation_type', e.target.value)}
                  fullWidth
                >
                  <MenuItem value="OneToMany">OneToMany</MenuItem>
                  <MenuItem value="ManyToOne">ManyToOne</MenuItem>
                  <MenuItem value="OneToOne">OneToOne</MenuItem>
                  <MenuItem value="ManyToMany">ManyToMany</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          ))}
          <Button onClick={() => setRelationships([...relationships, {
            from_class: '', to_class: '', relation_type: 'OneToMany'
          }])}>
            Add Relationship
          </Button>

          <Box mt={2}>
            <Button variant="contained" onClick={handleSubmit}>
              {editingId ? 'Update Project' : 'Create Project'}
            </Button>
            <Button sx={{ ml: 2 }} onClick={resetForm}>Clear</Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
