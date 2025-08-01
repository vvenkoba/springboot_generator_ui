import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";
import { Container, Grid, Paper, Typography, Button, TextField, List, ListItem, ListItemText } from "@mui/material";

const API_BASE_URL = "http://127.0.0.1:8000"; // Update based on backend API

const FileComparisonView = () => {
    const { record_id } = useParams();
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [uploadedContent, setUploadedContent] = useState("");
    const [migratedContent, setMigratedContent] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFiles(record_id);
    }, [record_id]);

    const fetchFiles = async (recordId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-folders/${recordId}?zip_files=false`);
            const allFiles = [...response.data.uploaded_files, ...response.data.migrated_files];
            setFiles(allFiles);
            setFilteredFiles(allFiles);
        } catch (error) {
            console.error("Error fetching file list:", error);
            setError("Failed to load file list.");
        }
    };

    const fetchFileContent = async (fileName) => {
        try {
            // const response = await axios.get(`${API_BASE_URL}/compare-files/${record_id}/${fileName}`);
            const response = axios.get(`${API_BASE_URL}/compare-files?record_id=${record_id}&filename=${encodeURIComponent(fileName)}`)

            setUploadedContent(response.data.uploaded_content);
            setMigratedContent(response.data.migrated_content);
            setSelectedFile(fileName);
        } catch (error) {
            console.error("Error fetching file:", error);
            setError("Failed to load file content.");
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchText(query);
        setFilteredFiles(files.filter((file) => file.toLowerCase().includes(query)));
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Compare Uploaded vs Migrated Files
            </Typography>

            {error && <Typography color="error">{error}</Typography>}

            <Grid container spacing={2}>
                {/* Left Panel: File Tree & Search */}
                <Grid item xs={3}>
                    <Paper style={{ padding: "10px", height: "80vh", overflowY: "auto" }}>
                        <Typography variant="h6">File Explorer</Typography>
                        <TextField
                            label="Search files..."
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={searchText}
                            onChange={handleSearch}
                        />
                        <List>
                            {filteredFiles.length > 0 ? (
                                filteredFiles.map((file) => (
                                    <ListItem button key={file} onClick={() => fetchFileContent(file)}>
                                        <ListItemText primary={`📄 ${file}`} />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography>No matching files found.</Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* Right Panel: Code Editors */}
                <Grid item xs={9}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Paper style={{ padding: "10px", height: "80vh" }}>
                                <Typography variant="h6">Uploaded Code</Typography>
                                <MonacoEditor height="70vh" theme="vs-dark" defaultLanguage="java" value={uploadedContent} />
                            </Paper>
                        </Grid>

                        <Grid item xs={6}>
                            <Paper style={{ padding: "10px", height: "80vh" }}>
                                <Typography variant="h6">Migrated Code</Typography>
                                <MonacoEditor height="70vh" theme="vs-dark" defaultLanguage="java" value={migratedContent} />
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Download ZIP Option */}
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "10px" }}
                        href={`${API_BASE_URL}/get-folders/${record_id}?zip_files=true`}
                        download
                    >
                        Download ZIP
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default FileComparisonView;
