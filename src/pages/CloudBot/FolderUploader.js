import React, { useState, useEffect } from "react";
import CodeEditor from "react-simple-code-editor";
import { Highlight, Prism } from "prism-react-renderer";
import JSZip from "jszip";

const FolderUploader = ({ initialFiles }) => {
    const [files, setFiles] = useState(initialFiles || {});
    const [selectedFile, setSelectedFile] = useState(null);
    const [code, setCode] = useState("");
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    useEffect(() => {
        if (initialFiles && typeof initialFiles === "object") {
            setFiles(initialFiles);
        }
    }, [initialFiles]);

    const handleFileClick = (fileName) => {
        if (!files[fileName]) return;
        setSelectedFile(fileName);
        setCode(files[fileName]);
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        setFiles({ ...files, [selectedFile]: newCode });
    };

    const renderFolderTree = (structure) => (
        <ul style={{ listStyle: "none", paddingLeft: "15px" }}>
            {Object.entries(structure).map(([key]) => (
                <li key={key} style={{ marginBottom: "8px" }}>
                    <button 
                        onClick={() => handleFileClick(key)} 
                        style={{ background: "#007bff", color: "white", padding: "5px 10px", borderRadius: "5px", cursor: "pointer", fontSize: "14px", border: "none" }}>
                        {key}
                    </button>
                </li>
            ))}
        </ul>
    );

    const handleDownloadProject = async () => {
        const zip = new JSZip();
        const folder = zip.folder("Project");

        Object.entries(files).forEach(([filename, content]) => {
            folder.file(filename, content);
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

    return (
        <div style={{ display: "flex", flexDirection: "column", padding: "20px", fontFamily: "Arial" }}>
            {/* Theme Toggle */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h2>📂 Project Explorer</h2>
                <label style={{ marginLeft: "15px", cursor: "pointer" }}>
                    <input 
                        type="checkbox" 
                        checked={isDarkTheme} 
                        onChange={() => setIsDarkTheme(!isDarkTheme)} 
                        style={{ marginRight: "5px" }}
                    />
                    Dark Mode
                </label>
            </div>

            {/* Folder Tree (Left) - Code Editor (Right) */}
            <div style={{ display: "flex", gap: "20px", height: "75vh" }}>
                {/* Folder Structure (Left) */}
                <div style={{
                    width: "30%", 
                    background: "#f8f9fa", 
                    padding: "15px", 
                    borderRadius: "8px",
                    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
                    overflowY: "auto"
                }}>
                    <h3>📁 Folder Explorer</h3>
                    {renderFolderTree(files)}
                </div>

                {/* Code Editor (Right) */}
                {selectedFile && (
                    <div style={{
                        width: "70%",
                        background: isDarkTheme ? "#000" : "#fff",
                        padding: "15px",
                        borderRadius: "8px",
                        boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
                        overflowY: "auto"
                    }}>
                        <h3 style={{ fontSize: "18px", color: isDarkTheme ? "#ffa500" : "#007bff" }}>
                            Editing: {selectedFile}
                        </h3>
                        <CodeEditor
                            value={code}
                            onValueChange={handleCodeChange} // ✅ Editable
                            highlight={(code) => (
                                <Highlight Prism={Prism} code={code} language="js">
                                    {({ tokens, getLineProps, getTokenProps }) => (
                                        <pre style={{ 
                                            padding: "15px", 
                                            background: isDarkTheme ? "#000" : "#fff",
                                            borderRadius: "5px",
                                            color: isDarkTheme ? "#ccc" : "#333",
                                            fontSize: "16px",
                                            fontFamily: "'Fira Code', monospace",
                                            lineHeight: "1.5"
                                        }}>
                                            {tokens.map((line, i) => (
                                                <div key={i} {...getLineProps({ line })}>
                                                    {line.map((token, key) => (
                                                        <span key={key} {...getTokenProps({ token })} />
                                                    ))}
                                                </div>
                                            ))}
                                        </pre>
                                    )}
                                </Highlight>
                            )}
                            padding={15}
                            style={{
                                background: isDarkTheme ? "#000" : "#fff",
                                color: isDarkTheme ? "#ccc" : "#333",
                                fontFamily: "'Fira Code', monospace",
                                fontSize: "16px",
                                lineHeight: "1.5"
                            }}
                        />
                        <button 
                            onClick={handleDownloadProject} 
                            style={{ 
                                marginTop: "15px", 
                                padding: "10px", 
                                fontSize: "16px", 
                                background: "#28a745", 
                                color: "white", 
                                border: "none", 
                                borderRadius: "5px", 
                                cursor: "pointer"
                            }}>
                            📥 Download Project
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FolderUploader;
