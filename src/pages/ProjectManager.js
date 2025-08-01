import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';

import {
    Box, Typography, TextField, Button, Grid, Card, CardContent,
    MenuItem, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
    Collapse, Snackbar, Alert
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';

const API_BASE = 'http://localhost:8000';
const fieldTypes = ['String', 'Long', 'Integer', 'Double', 'Boolean', 'Date'];

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [classes, setClasses] = useState([{ name: '', fields: [{ name: '', type: '' }] }]);
    const [relationships, setRelationships] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

    useEffect(() => {
        loadProjects();
    }, []);

    const handleGenerate = async (id) => {
        try {
            await axios.post(`${API_BASE}/generate/${id}`);
            showSnackbar('Project generated', 'success');
        } catch {
            showSnackbar('Generation failed', 'error');
        }
    };
    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const loadProjects = async () => {
        try {
            const res = await axios.get(`${API_BASE}/project/`);
            setProjects(res.data);
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

    const handleDownload = async (projectId) => {
        try {
            const response = await fetch(`/download/${projectId}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Failed to download project');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `project_${projectId}.zip`);
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
        }
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
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Project Manager</Typography>

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
                    <TextField
                        label="Prompt"
                        fullWidth
                        multiline
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        sx={{ mb: 3 }}
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

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Project ID</TableCell>
                            <TableCell>Prompt</TableCell>

                            <TableCell>Class</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((proj) => (
                            <TableRow key={proj.id}>
                                <TableCell>#{proj.id}</TableCell>
                                <TableCell>{proj.prompt || '—'}</TableCell>
                                <TableCell>{proj?.classes?.length || '—'}</TableCell>
                                <TableCell>{new Date(proj.created_time).toLocaleString()}</TableCell>
                                <TableCell>{proj.status.charAt(0).toUpperCase() + proj.status.slice(1) || '—'}</TableCell>

                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleGenerate(proj.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        Generate
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleDownload(proj.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        Preview
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleDownload(proj.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        Download
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        startIcon={<Edit />}
                                        onClick={() => handleEdit(proj)}
                                        sx={{ mr: 1 }}
                                    >

                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Delete />}
                                        onClick={() => setDeleteDialog({ open: true, id: proj.id })}
                                    >

                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            {/* <Grid container spacing={2}>
                {projects.map((proj) => (
                    <Grid item xs={12} md={6} key={proj.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Project #{proj.id}</Typography>
                                <Typography variant="body2">Prompt: {proj.prompt || '—'}</Typography>
                                <Typography variant="body2">Status: {proj.status || '—'}</Typography>
                                <Typography variant="body2">Class: {proj?.classes?.length || '—'}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Created: {new Date(proj.created_time).toLocaleString()}
                                </Typography>
                                <Box mt={2}>
                                    <Button variant="outlined" color="primary" onClick={() => handleGenerate(proj.id)} sx={{ mr: 1 }}>
                                        Generate
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Edit />}
                                        onClick={() => handleEdit(proj)}
                                        sx={{ mr: 1 }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Delete />}
                                        onClick={() => setDeleteDialog({ open: true, id: proj.id })}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid> */}


            {/* Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, id: null })}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this project?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
                    <Button
                        onClick={() => handleDelete(deleteDialog.id)}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>

        </Box>
    );
};

export default ProjectManager;
