import React from "react";

const FileUploaded = ({ initialFiles }) => {
    if (!initialFiles || Object.keys(initialFiles).length === 0) {
        return <h3>No Files Uploaded</h3>;
    }

    const renderFolderTree = (structure) => (
        <ul>
            {Object.entries(structure).map(([key, value]) => (
                <li key={key}>
                    {typeof value === "string" ? `📄 ${key}` : (
                        <>
                            <strong>📁 {key}</strong>
                            {renderFolderTree(value)}
                        </>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <div style={{ padding: "20px", background: "#f9f9f9", borderRadius: "10px" }}>
            <h3>📂 Converted Folder Structure</h3>
            {renderFolderTree(initialFiles)}
        </div>
    );
};

export default FileUploaded;
