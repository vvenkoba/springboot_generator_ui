import React, { useState } from "react";
import Folder from "../Folder";
import FolderUploader from "./FolderUploader";

const FolderAnalyzer = () => {
    const [folderName, setFolderName] = useState("");
    const [files, setFiles] = useState([]);
    const [fileStats, setFileStats] = useState({});
    const [fileDetails, setFileDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [converted, setConverted] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const [initialFiles, setInitialFiles] = useState();
    const handleUpload = (event) => {

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

        setInitialFiles(folderStructure);

        // const uploadedFiles = Array.from(event.target.files);
        const stats = {};
        const detailsPromises = [];

        if (uploadedFiles.length > 0) {
            const firstFilePath = uploadedFiles[0].webkitRelativePath;
            setFolderName(firstFilePath.split("/")[0]); // Get the root folder name
        }

        uploadedFiles.forEach(file => {
            const ext = file.name.split('.').pop();
            stats[ext] = (stats[ext] || 0) + 1;
            detailsPromises.push(countFileLines(file));
        });

        setFiles(uploadedFiles);
        setFileStats(stats);

        Promise.all(detailsPromises).then(results => {
            setFileDetails(results);
        });
    };

    const countFileLines = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                const lines = reader.result.split("\n").length;
                resolve({ name: file.name, lines });
            };
            reader.readAsText(file);
        });
    };

    const renderFileTree = (files, fileDetails) => {
        return (
            <ul>
                {files.map(file => {
                    const fileDetail = fileDetails.find(detail => detail.name === file.name);
                    return (
                        <li key={file.name}>
                            {file.name.includes(".") ? "📄" : "📁"} {file.name}
                            {fileDetail ? ` (Lines: ${fileDetail.lines})` : ""}
                        </li>
                    );
                })}
            </ul>
        );
    };

    const handleConvert = () => {
        setLoading(true);
        setConverted(false);

        const messages = [
            "Project Analysing...",
            "Planning and Estimation...",
            "Code Processing...",
            "Training Data...",
            "Selecting Model...",
            "Fine Tuning...",
            "Code Translation...",
            "Code Generation...",
            "Automating Test Cases...",
            "Code Refactoring...",
            "Code Optimization...",
            "Code Review...",
            "Deployment Pipelines...",
            "Downloading Format...",
            "Almost Ready...",
        ];

        let index = 0;
        const interval = setInterval(() => {
            setLoadingMessage(messages[index]);
            index++;
            if (index >= messages.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setLoading(false);
                    setConverted(true);
                }, 1000);
            }
        }, 1000);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h2>📂 Project Migrator</h2>
            {!loading && !converted && (
                <>
                    <input type="file" webkitdirectory="true" directory multiple onChange={handleUpload} />
                    {folderName && <h3>📁 Folder: {folderName}</h3>}

                    {files.length > 0 && (
                        <>
                            <h3>🔢 File Type Counts</h3>
                            <ul>
                                {Object.entries(fileStats)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([type, count]) => (
                                        <li key={type}><strong>{type}</strong>: {count} files</li>
                                    ))}
                                )}
                            </ul>

                            <h3>📂 Folder Structure</h3>
                            {renderFileTree(files, fileDetails)}

                            <button onClick={handleConvert} style={{
                                padding: "10px 20px",
                                fontSize: "16px",
                                marginTop: "10px",
                                cursor: "pointer",
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "5px"
                            }}>
                                Convert
                            </button>
                        </>
                    )}
                </>
            )}

            {loading && (
                <>
                    <h3>{loadingMessage}</h3>
                    <progress />
                </>
            )}

            {converted && <><h3 style={{ color: "green", fontSize: "24px" }}>✅ Converted!</h3>
                <Folder />

                <button onClick={handleConvert} style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    marginTop: "10px",
                    cursor: "pointer",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px"
                }}>
                    Download
                </button>
            </>}
        </div>
    );
};

export default FolderAnalyzer;
