import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, MenuItem, Paper, Dialog, DialogTitle, DialogContent,
  IconButton, TablePagination, Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import PlayArrow from "@mui/icons-material/PlayArrow";
import DescriptionIcon from "@mui/icons-material/Description";

const kafkaOptions = ["Azure HDInsight Kafka", "Apache Kafka","Cloudera Kafka","Aiven Kafka","IBM Event Streams","Red Hat AMQ Streams", "Amazon MSK (Managed Streaming for Apache Kafka)"];
const llmOptions = ["Azure OpenAI", "AWS Bedrock", "Google Vertex AI"];

const SimpleKafkaMigration = () => {
  const [migrations, setMigrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: null, folderName: "", kafka: "", llm: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setMigrations(JSON.parse(localStorage.getItem("automigration")) || []);
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem("automigration", JSON.stringify(data));
    setMigrations(data);
  };

  const handleDelete = (id) => {
    const updatedMigrations = migrations.filter((mig) => mig.id !== id);
    saveToLocalStorage(updatedMigrations);
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const folderName = files[0].webkitRelativePath.split("/")[0]; // Extract folder name
      setFormData({ ...formData, folderName, fileCount: files.length });
    }
  };

  const handleEditClick = (migration) => {
    setEditMode(true);
    setOpenForm(true);
    console.log(migration);
    setFormData({
      id: migration.id,
      folderName: migration.folderName,
      fileCount:migration.fileCount,
      kafka: migration.kafka,
      llm: migration.llm,
    });
  };

  const handleSubmit = () => {
    if (!formData.folderName || !formData.kafka || !formData.llm) return alert("All fields are required!");
console.log(formData);
    const updatedMigrations = editMode
      ? migrations.map((mig) =>
          mig.id === formData.id
            ? { ...mig, folderName: formData.folderName,fileCount:formData.fileCount, kafka: formData.kafka, llm: formData.llm }
            : mig
        )
      : [...migrations, { ...formData, id: Date.now(), status: "Uploaded", dateTime: new Date().toLocaleString() }];

    saveToLocalStorage(updatedMigrations);
    setOpenForm(false);
    setEditMode(false);
  };

  const filteredMigrations = migrations.filter((mig) =>
    mig.folderName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    mig.kafka?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const sortedMigrations = [...filteredMigrations].sort((a, b) =>
    sortOrder === "asc" ? a.dateTime.localeCompare(b.dateTime) : b.dateTime.localeCompare(a.dateTime)
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Box display="flex" gap={2} mb={2}>
        <TextField label="Search" variant="outlined" onChange={(e) => setSearchTerm(e.target.value)} sx={{ flexGrow: 1 }} />
        <Button variant="contained" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
          Sort {sortOrder === "asc" ? "↓" : "↑"}
        </Button>
        <Button variant="contained" onClick={() => { setOpenForm(true); setEditMode(false); setFormData({ id: null, folderName: "", kafka: "", llm: "" }); }}>
          New Migration
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Folder Name</TableCell>
              <TableCell>Kafka Distribution</TableCell>
              <TableCell>LLM Model</TableCell>
              <TableCell>File Count</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date-Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedMigrations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((mig) => (
              <TableRow key={mig.id}>
                <TableCell>{mig.id}</TableCell>
                <TableCell>{mig.folderName}</TableCell>
                <TableCell>{mig.kafka}</TableCell>
                <TableCell>{mig.llm}</TableCell>
                <TableCell>{mig.fileCount || 0}</TableCell>
                <TableCell>{mig.status}</TableCell>
                <TableCell>{mig.dateTime}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(mig)}><EditIcon /></IconButton>
                  <IconButton><VisibilityIcon /></IconButton>
                    <IconButton><PlayArrow  color="primary"/></IconButton>
                  <IconButton><DownloadIcon /></IconButton>
                
                  <IconButton><DescriptionIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(mig.id)}><DeleteIcon color="error" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={sortedMigrations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>{editMode ? "Edit Migration" : "New Migration"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} p={2}>
            <input type="file" webkitdirectory="true" multiple onChange={handleFileUpload} />
            <TextField label="Folder Name" fullWidth value={formData.folderName} onChange={(e) => setFormData({ ...formData, folderName: e.target.value })} />
            <TextField select label="Kafka Distribution" fullWidth value={formData.kafka} onChange={(e) => setFormData({ ...formData, kafka: e.target.value })}>
              {kafkaOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <TextField select label="LLM Model" fullWidth value={formData.llm} onChange={(e) => setFormData({ ...formData, llm: e.target.value })}>
              {llmOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <Button variant="contained" onClick={handleSubmit}>{editMode ? "Save Changes" : "Submit"}</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SimpleKafkaMigration;
