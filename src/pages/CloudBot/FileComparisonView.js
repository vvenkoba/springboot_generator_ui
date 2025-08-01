import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    TextField,
    Box
} from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SecondarySearchAppBar from "../SecondarySearchAppBar";

const API_BASE_URL = 'https://kafkamigrationinstance-ccg9g3avddhvbfbt.southindia-01.azurewebsites.net';

const FileComparisonView = () => {
    const { record_id, folder } = useParams();
    const [fileTree, setFileTree] = useState({});
    const [filteredTree, setFilteredTree] = useState({});
    const [uploadedContent, setUploadedContent] = useState("");
    const [migratedContent, setMigratedContent] = useState("");
    const [selectedFile, setSelectedFile] = useState("");
    const [searchText, setSearchText] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (record_id) fetchFolders(record_id);
    }, [record_id]);

    useEffect(() => {
        setFilteredTree(filterTree(fileTree, searchText));
    }, [fileTree, searchText]);

    const fetchFolders = async (recordId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/get-folders/${recordId}`);
            const allFiles = [...new Set([...response.data.uploaded_files, ...response.data.migrated_files])];
            setFileTree(buildFileTree(allFiles));
        } catch (err) {
            console.error("Error fetching folder structure:", err);
            setError("Failed to load folder structure.");
        }
    };

    const fetchFileContent = async (fullPath) => {
        const encodedFilename = encodeURIComponent(fullPath);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/compare-files?record_id=${record_id}&folder=${folder}&filename=${encodedFilename}`
            );
            setUploadedContent(response.data.uploaded_content);
            setMigratedContent(response.data.migrated_content?.replace("```java", "")?.replace("```", ""));
            setSelectedFile(fullPath);
        } catch (err) {
            console.error("Error fetching file content:", err);
            setError("Failed to load file content.");
        }
    };

    const buildFileTree = (files) => {
        const tree = {};
        files.forEach((filePath) => {
            const parts = filePath.split("/");
            let current = tree;
            parts.forEach((part) => {
                if (!current[part]) current[part] = {};
                current = current[part];
            });
        });
        return tree;
    };

    function removeEmptyFirstLine(text) {
        const lines = text.split("\n");
        if (lines.length > 0 && lines[0].trim() === "") {
            lines.shift(); // Remove the first line
        }
        return lines.join("\n");
    }

    const filterTree = (tree, query, path = "") => {
        if (!query) return tree;
        const filtered = {};
        Object.keys(tree).forEach((key) => {
            const fullPath = path ? `${path}/${key}` : key;
            const childrenFiltered = filterTree(tree[key], query, fullPath);
            if (key.toLowerCase().includes(query.toLowerCase()) || Object.keys(childrenFiltered).length > 0) {
                filtered[key] = childrenFiltered;
            }
        });
        return filtered;
    };



    const getAllNodeIds = (tree, path = "") => {
        let nodeIds = [];
        Object.keys(tree).forEach((key) => {
            const fullPath = path ? `${path}/${key}` : key;
            nodeIds.push(fullPath);
            nodeIds = nodeIds.concat(getAllNodeIds(tree[key], fullPath));
        });
        return nodeIds;
    };

    const renderTreeItems = (tree, path = "") => {
        return Object.keys(tree).map((key) => {
            const fullPath = path ? `${path}/${key}` : key;
            const children = tree[key];
            const isLeaf = Object.keys(children).length === 0;
            return (
                <TreeItem
                    key={fullPath}
                    nodeId={fullPath}
                    label={<Box sx={{ wordBreak: "break-all" }}>{key}</Box>}
                    onClick={(event) => {
                        event.stopPropagation();
                        if (isLeaf) fetchFileContent(fullPath);
                    }}
                >
                    {!isLeaf ? renderTreeItems(children, fullPath) : null}
                </TreeItem>
            );
        });
    };

    return (
        <>
            <Container maxWidth={false} sx={{ padding: 2 }}>

                <Typography variant="h4" gutterBottom>
                    Kafka Migration Comparison
                </Typography>
                <Typography variant="h6" gutterBottom>
                    (Uploaded vs Migrated Files)
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <Grid container spacing={2}>
                    <Grid item xs={3} sx={{ maxHeight: "calc(100vh - 16px)", overflowY: "auto" }}>
                        <Paper sx={{ padding: 2, height: "100%" }}>
                            <TextField
                                label="Search files..."
                                placeholder="Enter file/folder name"
                                variant="outlined"
                                fullWidth
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TreeView
                                aria-label="file system navigator"
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpandIcon={<ChevronRightIcon />}
                                defaultExpanded={getAllNodeIds(fileTree)}  // Ensures all nodes are expanded
                                sx={{ flexGrow: 1, overflowY: "auto" }}
                            >
                                {renderTreeItems(filteredTree)}
                            </TreeView>
                        </Paper>
                    </Grid>
                    <Grid item xs={9}>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Compare Files {selectedFile && `(${selectedFile})`}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1">Uploaded Code</Typography>
                                    <MonacoEditor
                                        height="70vh"
                                        theme="vs-dark"
                                        defaultLanguage="java"
                                        value={uploadedContent}
                                        options={{ readOnly: false }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1">Migrated Code</Typography>
                                    <MonacoEditor
                                        height="70vh"
                                        theme="vs-dark"
                                        defaultLanguage="java"
                                        value={removeEmptyFirstLine(migratedContent)}
                                        options={{ readOnly: false }}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                href={`${API_BASE_URL}/export-comparison/${record_id}`}
                                download
                            >
                                Download Comparison ZIP
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default FileComparisonView;
