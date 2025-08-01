import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import JSZip from "jszip";

const VSCodeView = () => {
    const [files, setFiles] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [expandedFolders, setExpandedFolders] = useState({});
    const [hasFiles, setHasFiles] = useState(false); // ✅ Track if files exist

    useEffect(() => {
        document.title = "Project Migrator"; // ✅ Set page title
    }, []);

    const handleUpload = (event) => {
        setLoading(true);
        setSelectedFile(null);
        setCode("");
        setFiles({});
        setHasFiles(false);

        const uploadedFiles = Array.from(event.target.files);
        const folderStructure = {};

        uploadedFiles.forEach(file => {
            const pathParts = file.webkitRelativePath.split("/");
            let current = folderStructure;

            pathParts.forEach((part, index) => {
                if (index === pathParts.length - 1) {
                    current[part] = file;
                } else {
                    current[part] = current[part] || {};
                    current = current[part];
                }
            });
        });

        setTimeout(() => {
            setLoading(false);
            setFiles(folderStructure);
            setExpandedFolders(Object.keys(folderStructure).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
            setHasFiles(Object.keys(folderStructure).length > 0); // ✅ Enable buttons if files exist
        }, 5000);
    };

    useEffect(() => {
        const messages = [
            "Project Analyzing...",
            "Processing Code...",
            "Code Generation...",
            "Optimizing Structure...",
            "Almost Ready..."
        ];
        let index = 0;
        const interval = setInterval(() => {
            setLoadingMessage(messages[index]);
            index++;
            if (index >= messages.length) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [loading]);

    const handleFileClick = async (file) => {
        setSelectedFile(file.name);
        const reader = new FileReader();
        reader.onload = () => setCode(reader.result);
        reader.readAsText(file);
    };

    const toggleFolder = (folder) => {
        setExpandedFolders({ ...expandedFolders, [folder]: !expandedFolders[folder] });
    };

    const handleDownloadProject = async () => {
        const zip = new JSZip();
        const folder = zip.folder("Project");

        Object.entries(files).forEach(([filename, content]) => {
            if (typeof content === "string") {
                folder.file(filename, content);
            }
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Project.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const renderFolderTree = (structure, path = "") => (
        <ul style={{ listStyle: "none", paddingLeft: "15px" }}>
            {Object.entries(structure).map(([key, value]) => (
                <li key={path + key} style={{ marginBottom: "8px" }}>
                    {value instanceof File ? (
                        <button
                            onClick={() => handleFileClick(value)}
                            style={{
                                background: "#007bff",
                                color: "white",
                                padding: "6px 12px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "14px",
                                border: "none",
                                transition: "0.3s",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                            }}>
                            📄 {key}
                        </button>
                    ) : (
                        <>
                            <strong
                                onClick={() => toggleFolder(path + key)}
                                style={{
                                    fontSize: "16px",
                                    color: "#333",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center"
                                }}>
                                {expandedFolders[path + key] ? "📂 ▼" : "📂 ▶"} {key}
                            </strong>
                            {expandedFolders[path + key] && renderFolderTree(value, path + key + "/")}
                        </>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", padding: "20px", fontFamily: "Arial" }}>
            <h2>📂 Project Migrator</h2>
            {/* Button Section */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <label style={{ padding: "10px 20px", background: "#007bff", color: "white", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>
                    Choose Folder
                    <input type="file" webkitdirectory="true" directory multiple onChange={handleUpload} style={{ display: "none" }} />
                </label>

                <button
                    onClick={handleDownloadProject}
                    disabled={!hasFiles}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: hasFiles ? "pointer" : "not-allowed",
                        backgroundColor: hasFiles ? "#28a745" : "#bbb",
                        color: "white",
                        border: "none",
                        borderRadius: "5px"
                    }}>
                    📥 Downloaded Migrated Project
                </button>

                {/* <button
                    onClick={() => alert("Pushing to repo...")}
                    disabled={!hasFiles}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: hasFiles ? "pointer" : "not-allowed",
                        backgroundColor: hasFiles ? "#ff4500" : "#bbb",
                        color: "white",
                        border: "none",
                        borderRadius: "5px"
                    }}>
                    🚀 Push to Repo
                </button> */}
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <h3>⚙️ {loadingMessage}</h3>
                    <progress />
                </div>
            )}

            {/* Folder View */}
            {!loading && Object.keys(files).length > 0 && (
                <div style={{ display: "flex", gap: "20px", height: "75vh" }}>
                    <div style={{ width: "30%", background: "#f8f9fa", padding: "15px", borderRadius: "8px", overflowY: "auto" }}>
                        <h3>📁 Folder Explorer</h3>
                        {renderFolderTree(files)}
                    </div>

                    {selectedFile && (
                        <div style={{ width: "70%", padding: "15px", borderRadius: "8px", background: "#1e1e1e" }}>
                            <h3 style={{ color: "#ffa500" }}>Editing: {selectedFile}</h3>
                            <Editor
                                height="70vh"
                                defaultLanguage="javascript"
                                theme="vs-dark"
                                value={code}
                                onChange={(newCode) => setCode(newCode)}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VSCodeView;
