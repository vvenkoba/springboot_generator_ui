import React, { useState, useEffect } from 'react';
import { Tooltip } from '@mui/material';
import { ChangeCircle, PublishedWithChanges } from '@mui/icons-material';
import { Radio, RadioGroup, FormControlLabel, FormControl, InputLabel, Select, MenuItem } from "@mui/material";


import { Download, PlayArrow, Edit, Preview, Delete, Compare } from '@mui/icons-material';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    IconButton,
    Typography,
    Snackbar,
    Alert,
    TablePagination,
    CircularProgress,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { keyframes } from '@mui/system';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = 'https://kafkamigrationinstance-ccg9g3avddhvbfbt.southindia-01.azurewebsites.net';
const SimpleKafkaMigrationNew = () => {
    // Records and dialogs states

    const [selectedOption, setSelectedOption] = useState(".zip");
    const [gitRepoURL, setGitRepoURL] = useState("");
    const [selectedGitClient, setSelectedGitClient] = useState("");
    const gitClients = ["GitHub", "GitLab", "Bitbucket", "Azure DevOps"];

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };


    const [records, setRecords] = useState([]);
    const [openNewDialog, setOpenNewDialog] = useState(false);
    const [newKafkaDistribution, setNewKafkaDistribution] = useState('');
    const [newLlmModel, setNewLlmModel] = useState('');
    const [newSelectedFile, setNewSelectedFile] = useState(null);
    const [newFolderName, setNewFolderName] = useState('');

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editRecordId, setEditRecordId] = useState(null);
    const [editFolderName, setEditFolderName] = useState('');
    const [editKafkaDistribution, setEditKafkaDistribution] = useState('');
    const [editLlmModel, setEditLlmModel] = useState('');

    // Snackbar state for info notifications.
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Pagination and search & sorting state.
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState(''); // column key
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    // Options for Autocomplete fields.
    //   const kafkaOptions = ['Apache Kafka', 'Confluent Kafka', 'Amazon MSK'];
    //   const llmOptions = ['GPT-4', 'GPT-3.5', 'BERT', 'RoBERTa'];
    const kafkaOptions = ["HDInsight Kafka", "Apache Kafka", "Cloudera Kafka", "Aiven Kafka", "IBM Event Streams", "Red Hat AMQ Streams", "Amazon MSK (Managed Streaming for Apache Kafka)"];
    const llmOptions = ["Hugging Face", "Azure OpenAI", "AWS Bedrock", "Google Vertex AI"];

    function capitalizeFirstLetter(string) {
        if (typeof string !== 'string' || string.length === 0) {
            return string; // Return the original string if it's not a string or empty
        }
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const HoverButton = ({ icon, text, onClick, color, disabled }) => {
        const [hovered, setHovered] = useState(false);

        return (
            <Tooltip title={text} arrow>
                <IconButton
                    onClick={onClick}
                    color={color}
                    disabled={disabled}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    style={{
                        // transition: 'transform 0.3s',
                        // transform: hovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                >
                    {hovered ? icon : icon}
                </IconButton>
            </Tooltip>
        );
    };

    // Helper function to show notifications.
    const showMessage = (msg) => {
        setSnackbarMessage(msg);
        setSnackbarOpen(true);
    };

    // Snackbar close handler.
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    // Fetch records from backend API.
    const fetchRecords = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/records`);
            if (response.ok) {
                const data = await response.json();
                setRecords(data);
            } else {
                console.error('Error fetching records.');
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    // Auto-poll if any record is "migrating" (every 10 seconds).
    useEffect(() => {
        const isMigrating = records.some(record => record.status === 'migrating');
        let intervalId;
        if (isMigrating) {
            intervalId = setInterval(() => {
                fetchRecords();
            }, 5000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [records]);

    // Filtering (search) and sorting.
    const getFilteredSortedRecords = () => {
        let filtered = records.filter(
            (record) =>
                record.folder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.kafka_distribution.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.llm_model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (sortBy) {
            filtered = filtered.sort((a, b) => {
                // For date_time field, compare dates.
                let valA = a[sortBy];
                let valB = b[sortBy];
                if (sortBy === 'date_time') {
                    valA = new Date(a[sortBy]);
                    valB = new Date(b[sortBy]);
                } else if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }
                if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    };

    // Pagination for displayed records.
    const filteredRecords = getFilteredSortedRecords();
    const paginatedRecords = filteredRecords.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Change page handler.
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Change rows per page handler.
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Sorting handler when clicking on a header.
    const handleSort = (column) => {
        if (sortBy === column) {
            // Toggle sort order.
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    // Render sort icon if sorted.
    const renderSortIcon = (column) => {
        if (sortBy !== column) return null;
        return sortOrder === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
    };

    // New Migration Dialog handlers.
    const handleNewDialogOpen = () => setOpenNewDialog(true);
    const handleNewDialogClose = () => {
        setOpenNewDialog(false);
        setNewKafkaDistribution('');
        setNewLlmModel('');
        setNewSelectedFile(null);
        setNewFolderName('');
    };

    const handleNewFileChange = (e) => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            setNewSelectedFile(file);
            const fName = file.name.replace(/\.zip$/i, '');
            setNewFolderName(fName);
        }
    };

    const handleNewMigrationSubmit = async () => {
        if (!newKafkaDistribution || !newLlmModel || !newSelectedFile || !newFolderName) {
            alert('Please complete the form (all fields are required) and select a .zip file.');
            return;
        }
        const formData = new FormData();
        formData.append('folder_name', newFolderName);
        formData.append('kafka_distribution', newKafkaDistribution);
        formData.append('llm_model', newLlmModel);
        formData.append('file', newSelectedFile);

        try {
            const resp = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
            });
            if (resp.ok) {
                showMessage('Record created successfully.');
                handleNewDialogClose();
                fetchRecords();
            } else {
                alert('Error uploading migration');
            }
        } catch (error) {
            console.error('Error uploading migration:', error);
            alert('Error uploading migration');
        }
    };

    // Download action.
    const handleDownload = async (record) => {

        if (["migrating", "uploaded"].includes(record.status?.toLowerCase())) {
            alert("You cannot download records with status uploaded or migrating.");
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/download/${record.id}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                // Append kafka_distribution to filename
                a.download = `${record.folder_name}-${record.kafka_distribution}-to-confluentkafka-migrated.zip`;
                a.href = url;
                document.body.appendChild(a);
                a.click();
                a.remove();
                showMessage('Downloaded successfully.');
            } else {
                alert('Download failed');
            }
        } catch (error) {
            console.error('Download error', error);
            alert('Download error');
        }
    };

    // Migrate action.
    const handleMigrate = async (record) => {


        if (["migrating"].includes(record.status?.toLowerCase())) {
            alert("Already migration is in progress!");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/migrate/${record.id}`, {
                method: 'POST',
            });
            if (response.ok) {
                showMessage('Migration started successfully.');
                fetchRecords();
            } else {
                alert('Migration failed');
            }
        } catch (error) {
            console.error('Error in migration:', error);
            alert('Error in migration');
        }
    };

    // Delete action.
    const handleDelete = async (record) => {
        if (!window.confirm(`Delete record for "${record.folder_name}"?`)) return;
        try {
            const response = await fetch(`${API_BASE_URL}/records/${record.id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                showMessage('Deleted successfully.');
                fetchRecords();
            } else {
                alert('Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Delete error');
        }
    };

    // Edit dialog handlers.
    const handleEditOpen = (record) => {
        setEditRecordId(record.id);
        setEditFolderName(record.folder_name); // non-editable
        setEditKafkaDistribution(record.kafka_distribution);
        setEditLlmModel(record.llm_model);
        setOpenEditDialog(true);
    };

    const handlePreviewOpen = (record) => {

        if (["migrating", "uploaded"].includes(record.status?.toLowerCase())) {
            alert("You cannot preview records with status uploaded or migrating.");
            return;
        }
        window.location.href = `/comparecode/${record.id}/${record.folder_name}`;
    };



    const handleEditClose = () => {
        setOpenEditDialog(false);
        setEditRecordId(null);
        setEditFolderName('');
        setEditKafkaDistribution('');
        setEditLlmModel('');
    };

    const handleEditSubmit = async () => {
        if (!editRecordId) return;
        const payload = {
            folder_name: editFolderName, // although it remains unchanged
            kafka_distribution: editKafkaDistribution,
            llm_model: editLlmModel,
        };
        try {
            const response = await fetch(`${API_BASE_URL}/records/${editRecordId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                showMessage('Record edited successfully.');
                handleEditClose();
                fetchRecords();
            } else {
                alert('Edit failed');
            }
        } catch (error) {
            console.error('Error editing record:', error);
            alert('Error editing record');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Kafka Migration to Confluent Kafka
            </Typography>
            {/* Search Field */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Search..."
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>

            <Button variant="contained" onClick={handleNewDialogOpen} sx={{ mb: 2 }}>
                Migrate New
            </Button>

            {/* Records Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#1976d2' }}>
                        <TableRow>
                            <TableCell sx={{ color: '#fff', cursor: 'pointer' }} onClick={() => handleSort('id')}>
                                ID {renderSortIcon('id')}
                            </TableCell>
                            <TableCell sx={{ color: '#fff', cursor: 'pointer' }} onClick={() => handleSort('folder_name')}>
                                Project Name {renderSortIcon('folder_name')}
                            </TableCell>
                            <TableCell sx={{ color: '#fff', cursor: 'pointer' }} onClick={() => handleSort('kafka_distribution')}>
                                Kafka Distribution {renderSortIcon('kafka_distribution')}
                            </TableCell>
                            <TableCell sx={{ color: '#fff', cursor: 'pointer' }} onClick={() => handleSort('llm_model')}>
                                LLM Model {renderSortIcon('llm_model')}
                            </TableCell>
                            <TableCell sx={{ color: '#fff', cursor: 'pointer' }} onClick={() => handleSort('date_time')}>
                                Date-Time {renderSortIcon('date_time')}
                            </TableCell>
                            <TableCell sx={{ color: '#fff', cursor: 'pointer' }} onClick={() => handleSort('status')}>
                                Status {renderSortIcon('status')}
                            </TableCell>
                            <TableCell sx={{ color: '#fff', cursor: 'pointer' }} onClick={() => handleSort('file_count')}>
                                File Count {renderSortIcon('file_count')}
                            </TableCell>
                            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRecords.map((record, index) => (
                            <TableRow
                                key={record.id}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? '#E3F2FD' : '#BBDEFB',
                                }}
                            >
                                <TableCell>{record.id}</TableCell>
                                <TableCell>{record.folder_name}</TableCell>
                                <TableCell>{record.kafka_distribution}</TableCell>
                                <TableCell>{record.llm_model}</TableCell>
                                <TableCell>
                                    {record.date_time ? new Date(record.date_time).toLocaleString() : ''}
                                </TableCell>
                                <TableCell>{capitalizeFirstLetter(record.status)}</TableCell>
                                <TableCell>{record.file_count}</TableCell>
                                <TableCell>

                                    <HoverButton

                                        icon={
                                            record.status === 'migrating' ? (
                                                <ChangeCircle
                                                    size={30}
                                                    sx={{
                                                        color: 'blue.500',
                                                        animation: record.status === 'migrating' ? `${spin} 1s linear infinite` : 'none',
                                                    }}
                                                />
                                            ) : record.status === 'uploaded' ? (
                                                <ChangeCircle size={28} sx={{ color: 'blue' }} />
                                            ) : record.status === 'migrated' ? (
                                                <PublishedWithChanges sx={{ color: 'green' }} />
                                            ) : (
                                                <PlayArrow />
                                            )
                                        }
                                        text="Migrate"
                                        onClick={() => handleMigrate(record)}
                                        color={record.status === 'uploading' ? 'default' : 'success'}
                                        disabled={record.status === 'uploading'}
                                    />

                                    <HoverButton
                                        icon={<Compare />}
                                        text="Preview"
                                        onClick={() => handlePreviewOpen(record)}
                                        color={record.status === 'migrated' ? 'success' : 'grey.500'}
                                    // sx={{ color: record.status === 'migrating' ? 'grey.500' : 'success.main' }}
                                    />

                                    <HoverButton
                                        icon={<Download />}
                                        text="Download"
                                        onClick={() => handleDownload(record)}
                                        color={record.status === 'migrated' ? 'success' : 'grey.500'}
                                    // sx={{ color: record.status === 'migrating' ? 'grey.500' : 'success.main' }}
                                    />

                                    <HoverButton icon={<Edit />} text="Edit" onClick={() => handleEditOpen(record)} color="primary" />
                                    <HoverButton icon={<Delete />} text="Delete" onClick={() => handleDelete(record)} color="error" />

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination */}
                <TablePagination
                    component="div"
                    count={filteredRecords.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>

            {/* New Migration Dialog */}
            <Dialog open={openNewDialog} onClose={handleNewDialogClose}>
                <DialogTitle>New Migration</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }} noValidate autoComplete="off">
                        <Autocomplete
                            freeSolo
                            options={kafkaOptions}
                            value={newKafkaDistribution}
                            onChange={(e, newValue) => setNewKafkaDistribution(newValue)}
                            onInputChange={(event, newInputValue) => setNewKafkaDistribution(newInputValue)}
                            renderInput={(params) => <TextField {...params} label="Kafka Distribution" margin="normal" fullWidth />}
                        />
                        <Autocomplete
                            freeSolo
                            options={llmOptions}
                            value={newLlmModel}
                            onChange={(e, newValue) => setNewLlmModel(newValue)}
                            onInputChange={(event, newInputValue) => setNewLlmModel(newInputValue)}
                            renderInput={(params) => <TextField {...params} label="LLM Model" margin="normal" fullWidth />}
                        />

                        <RadioGroup row value={selectedOption} onChange={handleOptionChange}>
                            <FormControlLabel value=".zip" control={<Radio />} label=".zip Folder" />
                            <FormControlLabel value="GIT" control={<Radio />} label="GIT Repository" />
                        </RadioGroup>

                        {/* Render .zip Upload if selected */}
                        {selectedOption === ".zip" && (
                            <>
                                <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                                    Select .zip File
                                    <input type="file" accept=".zip" hidden onChange={handleNewFileChange} />
                                </Button>
                                {newSelectedFile && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Selected File: {newSelectedFile.name}
                                    </Typography>
                                )}
                            </>
                        )}

                        {/* Render Git Repo URL Input if GIT selected */}
                        {selectedOption === "GIT" && (
                            <>
                                {/* <FormControl fullWidth margin="normal">
                                    <InputLabel>Select Git Client</InputLabel>
                                    <Select value={selectedGitClient} onChange={(e) => setSelectedGitClient(e.target.value)}>
                                        {gitClients.map((client) => (
                                            <MenuItem key={client} value={client}>
                                                {client}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl> */}

                                <Autocomplete
                                    freeSolo
                                    options={gitClients}
                                    value={selectedGitClient}
                                    onChange={(e, newValue) => setSelectedGitClient(newValue)}
                                    onInputChange={(event, newInputValue) => setSelectedGitClient(newInputValue)}
                                    renderInput={(params) => <TextField {...params} label="Select Git Client" margin="normal" fullWidth />}
                                />
                                <TextField
                                    label="Git Repository URL"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={gitRepoURL}
                                    onChange={(e) => setGitRepoURL(e.target.value)}
                                />
                            </>
                        )}

                        {/* Project Name Field (Read-Only) */}
                        <TextField
                            label="Project Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={newFolderName}
                            InputProps={{ readOnly: true }}
                        />

                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNewDialogClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleNewMigrationSubmit}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Record Dialog */}
            <Dialog open={openEditDialog} onClose={handleEditClose}>
                <DialogTitle>Edit Record</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ '& .MuiTextField-root': { my: 1, width: '100%' } }} noValidate autoComplete="off">
                        {/* Folder Name remains non editable */}
                        <TextField
                            label="Project Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={editFolderName}
                            disabled
                        />
                        <Autocomplete
                            freeSolo
                            options={kafkaOptions}
                            value={editKafkaDistribution}
                            onChange={(e, newValue) => setEditKafkaDistribution(newValue)}
                            onInputChange={(event, newInputValue) => setEditKafkaDistribution(newInputValue)}
                            renderInput={(params) => <TextField {...params} label="Kafka Distribution" margin="normal" fullWidth />}
                        />
                        <Autocomplete
                            freeSolo
                            options={llmOptions}
                            value={editLlmModel}
                            onChange={(e, newValue) => setEditLlmModel(newValue)}
                            onInputChange={(event, newInputValue) => setEditLlmModel(newInputValue)}
                            renderInput={(params) => <TextField {...params} label="LLM Model" margin="normal" fullWidth />}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditSubmit}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SimpleKafkaMigrationNew;
