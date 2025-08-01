import React, { useState, useEffect } from "react";
import {
    Container, Typography, Button, TextField, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Autocomplete, Box, Dialog, DialogTitle, DialogContent, DialogActions, Input
} from "@mui/material";
import { Edit, Delete, UploadFile, Clear, Add, Search } from "@mui/icons-material";

const promptTypes = [
    "Boiler Plate Code with configurations",
    "Upgrade Versions AngularJS to Latest Angular versions, React 16 to React 18",
    "Code Migration (Angular UI to React JS, Angular MVC to NextJS/React + NodeJS API)",
    "Refactoring to better code and format",
    "Fixing Vulnerabilities",
    "Write Test Cases and increase coverage",
    "Documentation of UI Code",
    "Swagger API documentation / Technical specification"
];

const initialPrompts = [
    { id: 1, promptKey: "/boilerplate", type: "Boiler Plate Code with configurations", keywords: "Configurations, Setup", description: "Create boilerplate code with standard configurations.", zipFile: null },
    { id: 2, promptKey: "/upgrade-angular-react", type: "Upgrade Versions AngularJS to Latest Angular versions, React 16 to React 18", keywords: "Angular, React Upgrade", description: "Upgrade AngularJS to the latest Angular version. Also upgrade React 16 to React 18.", zipFile: null },
    { id: 3, promptKey: "/code-migration", type: "Code Migration", keywords: "React, NextJS, Database", description: "Migrate Angular UI to React. Convert Angular MVC to NextJS or React + Node.js API.", zipFile: null },
    { id: 4, promptKey: "/refactoring", type: "Refactoring", keywords: "Optimization, Formatting", description: "Refactor code for better structure, readability, and maintainability.", zipFile: null },
    { id: 5, promptKey: "/security-fixes", type: "Security Fixes", keywords: "Security, Vulnerabilities", description: "Identify and fix vulnerabilities in the codebase.", zipFile: null },
    { id: 6, promptKey: "/testing-coverage", type: "Testing & Coverage", keywords: "Test Cases, Coverage Report", description: "Write unit & integration test cases and generate coverage reports.", zipFile: null },
    { id: 7, promptKey: "/documentation", type: "Documentation", keywords: "Code Docs, UI Docs", description: "Create and maintain proper documentation for UI components and API usage.", zipFile: null },
    { id: 8, promptKey: "/api-docs", type: "API Documentation", keywords: "Swagger, Technical Specs", description: "Generate Swagger API documentation and functional requirement mapping to code.", zipFile: null },
];

const PromptManager = () => {
    const [prompts, setPrompts] = useState([]);
    const [promptKey, setPromptKey] = useState("");
    const [promptType, setPromptType] = useState("");
    const [keywords, setKeywords] = useState("");
    const [description, setDescription] = useState("");
    const [zipFile, setZipFile] = useState(null);
    const [editingPrompt, setEditingPrompt] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const storedPrompts = JSON.parse(localStorage.getItem("prompts"));
        if (storedPrompts && storedPrompts.length > 0) {
            setPrompts(storedPrompts);
        } else {
            setPrompts(initialPrompts);
        }
    }, []);

    // useEffect(() => {
    //     localStorage.setItem("prompts", JSON.stringify(prompts));
    // }, [prompts]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.name.endsWith(".zip")) {
            const reader = new FileReader();
            reader.onload = () => setZipFile(reader.result);
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid ZIP file.");
        }
    };

    const handleRemoveFile = () => {
        setZipFile(null);
    };

    const handleAddPrompt = () => {
        if (!promptKey.startsWith("/") || !promptType || !keywords || !description) {
            alert("Ensure 'Prompt Key' starts with '/' and all required fields are filled.");
            return;
        }

        const newPrompt = {
            id: prompts.length + 1,
            promptKey,
            type: promptType,
            keywords,
            description,
            zipFile,
        };

        setPrompts([...prompts, newPrompt]);
        resetForm();
        setOpenModal(false);
    };

    const handleEditPrompt = (prompt) => {
        setEditingPrompt(prompt);
        setPromptKey(prompt.promptKey);
        setPromptType(prompt.type);
        setKeywords(prompt.keywords);
        setDescription(prompt.description);
        setZipFile(prompt.zipFile);
        setOpenModal(true);
    };

    const handleUpdatePrompt = () => {
        if (!editingPrompt) return;

        const updatedPrompts = prompts.map((p) =>
            p.id === editingPrompt.id ? { ...p, promptKey, type: promptType, keywords, description, zipFile } : p
        );

        setPrompts(updatedPrompts);
        resetForm();
        setOpenModal(false);
    };

    const handleDeletePrompt = (id) => {
        setPrompts(prompts.filter((p) => p.id !== id));
    };

    const resetForm = () => {
        setEditingPrompt(null);
        setPromptKey("");
        setPromptType("");
        setKeywords("");
        setDescription("");
        setZipFile(null);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Prompt Enhancement Configuration Tool
            </Typography>

            {/* Search Bar */}
            <Box display="flex" alignItems="center" mb={2}>
                <Search style={{ marginRight: 10 }} />
                <Input
                    placeholder="Search prompts..."
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            {/* Add Button */}
            <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
                <Add /> Add New Prompt
            </Button>

            {/* Modal for Add/Edit */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editingPrompt ? "Edit Prompt" : "Add Prompt"}</DialogTitle>
                <DialogContent>
                    <TextField label="Prompt Key (Starts with '/')" variant="outlined" fullWidth value={promptKey} onChange={(e) => setPromptKey(e.target.value)} style={{ marginBottom: 10 }} />
                    <Autocomplete options={promptTypes} value={promptType} onChange={(event, newValue) => setPromptType(newValue)}
                        renderInput={(params) => <TextField {...params} label="Prompt Type" variant="outlined" />} style={{ marginBottom: 10 }} />
                    <TextField label="Keywords" variant="outlined" fullWidth value={keywords} onChange={(e) => setKeywords(e.target.value)} style={{ marginBottom: 10 }} />
                    <TextField label="Description" variant="outlined" fullWidth value={description} onChange={(e) => setDescription(e.target.value)} style={{ marginBottom: 10 }} />
                </DialogContent>
            </Dialog>

            {/* Prompt Table */}
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f5f5f5", fontWeight: "bold" }}>
                        <TableRow>

                            <TableCell
                                sx={{
                                    bgcolor: "#007BFF",
                                    color: "white",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    borderRadius: "5px",
                                    boxShadow: "0px 4px 10px rgba(0, 123, 255, 0.5)",
                                    transition: "all 0.3s ease-in-out",
                                    "&:hover": {
                                        filter: "brightness(1.2)",
                                        boxShadow: "0px 6px 15px rgba(0, 123, 255, 0.7)",
                                    }
                                }}
                            >Prompt Key</TableCell>
                            <TableCell>Prompt Type</TableCell>
                            <TableCell>Possible Keywords</TableCell>
                            <TableCell>SME Enhanced Prompt</TableCell>
                            <TableCell>Sample Data (Training RAG)</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prompts.map((prompt) => (
                            <TableRow key={prompt.id} sx={{ height: "18px", padding: "2px" }}>

                                <TableCell
                                    sx={{
                                        bgcolor: "#007BFF",
                                        color: "white",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderRadius: "5px",
                                        boxShadow: "0px 4px 10px rgba(0, 123, 255, 0.5)",
                                        transition: "all 0.3s ease-in-out",
                                        "&:hover": {
                                            filter: "brightness(1.2)",
                                            boxShadow: "0px 6px 15px rgba(0, 123, 255, 0.7)",
                                        }
                                    }}
                                >
                                    {prompt.promptKey}
                                </TableCell>
                                <TableCell>{prompt.type}</TableCell>

                                <TableCell>{prompt.keywords}</TableCell>
                                <TableCell>{prompt.description}</TableCell>
                                <TableCell>
                                    <IconButton color="primary"><UploadFile /></IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="secondary"><Edit /></IconButton>
                                    <IconButton color="error"><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default PromptManager;
