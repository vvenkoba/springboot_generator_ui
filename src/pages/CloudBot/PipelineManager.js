import React, { useState, useEffect } from "react";
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Container,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// --------------------------------------------------
// Constants: Local Storage & Default Master Data
// --------------------------------------------------
const LOCAL_STORAGE_KEY = "pipelineOptions";
const defaultPipelineOptions = {
  platforms: [
    { id: "plat1", label: "Bedrock (AWS)", description: "Default AWS platform" },
    { id: "plat2", label: "Open AI (Azure)", description: "Default Azure platform" },
    { id: "plat3", label: "Vertex AI (GCP)", description: "Default GCP platform" },
  ],
  models: [
    { id: "model1", label: "Cohere Command R+", platformId: "plat1", description: "Default model for AWS" },
    { id: "model2", label: "GPT-4", platformId: "plat2", description: "Default model for Azure" },
    { id: "model3", label: "Gemini Pro", platformId: "plat3", description: "Default model for GCP" },
  ],
  // Each objective: { id, label, platformIds: [], modelIds: [], inputMethods: [] }
  objectives: [
    // You may predefine objectives here, for example:
    // { id: "obj1", label: "Extraction and Analysis", platformIds: ["plat1","plat2"], modelIds: ["model1"], inputMethods: ["File Upload"] }
  ],
  // Global master list for available input methods.
  availableInputMethods: ["File Upload", "API Gateway", "S3 Event", "Manual Entry"],
};

// --------------------------------------------------
// Custom Styled Tabs for a Better UI
// --------------------------------------------------
const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "#ff9800",
  },
});
const StyledTab = styled(Tab)({
  fontWeight: "bold",
  textTransform: "none",
  color: "#333",
  "&.Mui-selected": {
    color: "#ff9800",
  },
});

// --------------------------------------------------
// Main PipelineManager Component with five tabs
// --------------------------------------------------
export default function PipelineManager() {
  const [pipelineOptions, setPipelineOptions] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultPipelineOptions;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pipelineOptions));
  }, [pipelineOptions]);

  // Tab indexes:
  // 0 => Platforms, 1 => Models, 2 => Objectives, 3 => Input Methods (master list),
  // 4 => Objective Input Methods (for each objective)
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#fff", boxShadow: "none", borderBottom: "1px solid #ccc" }}
      >
        <StyledTabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
          <StyledTab label="Platforms" />
          <StyledTab label="Models" />
          <StyledTab label="Objectives (Agents)" />
          <StyledTab label="Input Methods" />
          <StyledTab label="Objective Input Methods" />
        </StyledTabs>
      </AppBar>
      <Box sx={{ mt: 2 }}>
        {tabIndex === 0 && <PlatformManagement pipelineOptions={pipelineOptions} setPipelineOptions={setPipelineOptions} />}
        {tabIndex === 1 && <ModelManagement pipelineOptions={pipelineOptions} setPipelineOptions={setPipelineOptions} />}
        {tabIndex === 2 && <ObjectiveManagement pipelineOptions={pipelineOptions} setPipelineOptions={setPipelineOptions} />}
        {tabIndex === 3 && <InputMethodManagement pipelineOptions={pipelineOptions} setPipelineOptions={setPipelineOptions} />}
        {tabIndex === 4 && (
          <ObjectiveInputMethodManagement pipelineOptions={pipelineOptions} setPipelineOptions={setPipelineOptions} />
        )}
      </Box>
    </Container>
  );
}

// --------------------------------------------------
// Tab 1: Platform Management Component
// --------------------------------------------------
function PlatformManagement({ pipelineOptions, setPipelineOptions }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState({ id: "", label: "", description: "" });

  const handleOpenAdd = () => {
    setCurrentPlatform({ id: "", label: "", description: "" });
    setOpenDialog(true);
  };

  const handleOpenEdit = (platform) => {
    setCurrentPlatform(platform);
    setOpenDialog(true);
  };

  const handleSavePlatform = () => {
    if (!currentPlatform.label.trim()) return;
    if (currentPlatform.id) {
      // Edit existing
      setPipelineOptions((prev) => ({
        ...prev,
        platforms: (prev.platforms ?? []).map((p) => (p.id === currentPlatform.id ? currentPlatform : p)),
      }));
    } else {
      // Add new platform
      const newPlatform = { ...currentPlatform, id: `plat${Date.now()}` };
      setPipelineOptions((prev) => ({
        ...prev,
        platforms: [...(prev.platforms ?? []), newPlatform],
      }));
    }
    setOpenDialog(false);
  };

  const handleDeletePlatform = (id) => {
    setPipelineOptions((prev) => ({
      ...prev,
      platforms: (prev.platforms ?? []).filter((p) => p.id !== id),
      models: (prev.models ?? []).filter((m) => m.platformId !== id),
      objectives: (prev.objectives ?? []).map((obj) => ({
        ...obj,
        platformIds: (obj.platformIds ?? []).filter((pid) => pid !== id),
      })),
    }));
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <h3>Platforms</h3>
        <Button variant="contained" size="small"  sx={{ minHeight: "32px", height: "32px", fontSize: "0.75rem" }}  onClick={handleOpenAdd}>
          Add Platform
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Platform Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(pipelineOptions.platforms ?? []).map((platform) => (
            <TableRow key={platform.id}>
              <TableCell>{platform.label}</TableCell>
              <TableCell>{platform.description || "-"}</TableCell>
              <TableCell align="right">
                <Button variant="outlined" onClick={() => handleOpenEdit(platform)} sx={{ mr: 1 }}>
                  Edit
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDeletePlatform(platform.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{currentPlatform.id ? "Edit Platform" : "Add Platform"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Platform Name"
            fullWidth
            value={currentPlatform.label}
            onChange={(e) => setCurrentPlatform({ ...currentPlatform, label: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={currentPlatform.description || ""}
            onChange={(e) => setCurrentPlatform({ ...currentPlatform, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" size="small"  sx={{ minHeight: "32px", height: "32px", fontSize: "0.75rem" }}  onClick={handleSavePlatform}>
            {currentPlatform.id ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

// --------------------------------------------------
// Tab 2: Model Management Component
// --------------------------------------------------
function ModelManagement({ pipelineOptions, setPipelineOptions }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentModel, setCurrentModel] = useState({ id: "", label: "", platformId: "", description: "" });

  const handleOpenAdd = () => {
    setCurrentModel({ id: "", label: "", platformId: "", description: "" });
    setOpenDialog(true);
  };

  const handleOpenEdit = (model) => {
    setCurrentModel(model);
    setOpenDialog(true);
  };

  const handleSaveModel = () => {
    if (!currentModel.label.trim() || !currentModel.platformId) return;
    if (currentModel.id) {
      setPipelineOptions((prev) => ({
        ...prev,
        models: (prev.models ?? []).map((m) => (m.id === currentModel.id ? currentModel : m)),
      }));
    } else {
      const newModel = { ...currentModel, id: `model${Date.now()}` };
      setPipelineOptions((prev) => ({
        ...prev,
        models: [...(prev.models ?? []), newModel],
      }));
    }
    setOpenDialog(false);
  };

  const handleDeleteModel = (id) => {
    setPipelineOptions((prev) => ({
      ...prev,
      models: (prev.models ?? []).filter((m) => m.id !== id),
      objectives: (prev.objectives ?? []).map((obj) => ({
        ...obj,
        modelIds: (obj.modelIds ?? []).filter((mid) => mid !== id),
      })),
    }));
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <h3>Models</h3>
        <Button variant="contained" size="small"  sx={{ minHeight: "32px", height: "32px", fontSize: "0.75rem" }}  onClick={handleOpenAdd}>
          Add Model
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Model Name</TableCell>
            <TableCell>Platform</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(pipelineOptions.models ?? []).map((model) => {
            const platform = (pipelineOptions.platforms ?? []).find((p) => p.id === model.platformId) || {};
            return (
              <TableRow key={model.id}>
                <TableCell>{model.label}</TableCell>
                <TableCell>{platform.label || "N/A"}</TableCell>
                <TableCell>{model.description || "-"}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleOpenEdit(model)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteModel(model.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{currentModel.id ? "Edit Model" : "Add Model"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Model Name"
            fullWidth
            value={currentModel.label}
            onChange={(e) => setCurrentModel({ ...currentModel, label: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={currentModel.description || ""}
            onChange={(e) => setCurrentModel({ ...currentModel, description: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Platform</InputLabel>
            <Select
              value={currentModel.platformId}
              onChange={(e) => setCurrentModel({ ...currentModel, platformId: e.target.value })}
              label="Platform"
            >
              {(pipelineOptions.platforms ?? []).map((plat) => (
                <MenuItem key={plat.id} value={plat.id}>
                  {plat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" size="small"  sx={{ minHeight: "32px", height: "32px", fontSize: "0.75rem" }}  onClick={handleSaveModel}>
            {currentModel.id ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

// --------------------------------------------------
// Tab 3: Objective Management Component
// --------------------------------------------------
function ObjectiveManagement({ pipelineOptions, setPipelineOptions }) {
  // Each objective: { id, label, platformIds: [], modelIds: [], inputMethods: [] }
  const [openDialog, setOpenDialog] = useState(false);
  const [currentObjective, setCurrentObjective] = useState({
    id: "",
    label: "",
    platformIds: [],
    modelIds: [],
    inputMethods: [],
  });

  const handleOpenAdd = () => {
    setCurrentObjective({ id: "", label: "", platformIds: [], modelIds: [], inputMethods: [] });
    setOpenDialog(true);
  };

  const handleOpenEdit = (objective) => {
    setCurrentObjective({
      ...objective,
      platformIds: objective.platformIds ?? [],
      modelIds: objective.modelIds ?? [],
      inputMethods: objective.inputMethods ?? [],
    });
    setOpenDialog(true);
  };

  const handleSaveObjective = () => {
    if (!currentObjective.label.trim()) return;
    if (currentObjective.id) {
      setPipelineOptions((prev) => ({
        ...prev,
        objectives: (prev.objectives ?? []).map((obj) =>
          obj.id === currentObjective.id ? currentObjective : obj
        ),
      }));
    } else {
      const newObjective = { ...currentObjective, id: `obj${Date.now()}` };
      setPipelineOptions((prev) => ({
        ...prev,
        objectives: [...(prev.objectives ?? []), newObjective],
      }));
    }
    setOpenDialog(false);
  };

  const handleDeleteObjective = (id) => {
    setPipelineOptions((prev) => ({
      ...prev,
      objectives: (prev.objectives ?? []).filter((obj) => obj.id !== id),
    }));
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <h3>Objectives</h3>
        <Button variant="contained" size="small"  sx={{ minHeight: "32px", height: "32px", fontSize: "0.75rem" }}  onClick={handleOpenAdd}>Add Objective</Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Objective Name</TableCell>
            <TableCell>Platforms</TableCell>
            <TableCell>Models</TableCell>
            <TableCell>Input Methods</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(pipelineOptions.objectives ?? []).map((obj) => {
            const platformLabels = (pipelineOptions.platforms ?? [])
              .filter((p) => (obj.platformIds ?? []).includes(p.id))
              .map((p) => p.label)
              .join(", ");
            const modelLabels = (pipelineOptions.models ?? [])
              .filter((m) => (obj.modelIds ?? []).includes(m.id))
              .map((m) => m.label)
              .join(", ");
            const inputMethods = (obj.inputMethods ?? []).join(", ");
            return (
              <TableRow key={obj.id}>
                <TableCell>{obj.label}</TableCell>
                <TableCell>{platformLabels || "-"}</TableCell>
                <TableCell>{modelLabels || "-"}</TableCell>
                <TableCell>{inputMethods || "-"}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleOpenEdit(obj)} sx={{ mr: 1 }}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteObjective(obj.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{currentObjective.id ? "Edit Objective" : "Add Objective"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Objective Name"
            fullWidth
            value={currentObjective.label}
            onChange={(e) => setCurrentObjective({ ...currentObjective, label: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Platforms</InputLabel>
            <Select
              multiple
              value={currentObjective.platformIds ?? []}
              onChange={(e) => setCurrentObjective({ ...currentObjective, platformIds: e.target.value })}
              renderValue={(selected) =>
                (pipelineOptions.platforms ?? [])
                  .filter((p) => selected.includes(p.id))
                  .map((p) => p.label)
                  .join(", ")
              }
              label="Platforms"
            >
              {(pipelineOptions.platforms ?? []).map((plat) => (
                <MenuItem key={plat.id} value={plat.id}>{plat.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Models</InputLabel>
            <Select
              multiple
              value={currentObjective.modelIds ?? []}
              onChange={(e) => setCurrentObjective({ ...currentObjective, modelIds: e.target.value })}
              renderValue={(selected) =>
                (pipelineOptions.models ?? [])
                  .filter((m) => selected.includes(m.id))
                  .map((m) => m.label)
                  .join(", ")
              }
              label="Models"
            >
              {(pipelineOptions.models ?? []).map((model) => (
                <MenuItem key={model.id} value={model.id}>{model.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Input Methods</InputLabel>
            <Select
              multiple
              value={currentObjective.inputMethods ?? []}
              onChange={(e) => setCurrentObjective({ ...currentObjective, inputMethods: e.target.value })}
              renderValue={(selected) => (selected ?? []).join(", ")}
              label="Input Methods"
            >
              {(pipelineOptions.availableInputMethods ?? []).map((method, idx) => (
                <MenuItem key={idx} value={method}>{method}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" size="small"  sx={{ minHeight: "32px", height: "32px", fontSize: "0.75rem" }}  onClick={handleSaveObjective}>
            {currentObjective.id ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

// --------------------------------------------------
// Tab 4: Input Method Management (Master List)
// --------------------------------------------------
function InputMethodManagement({ pipelineOptions, setPipelineOptions }) {
  const availableMethods = pipelineOptions.availableInputMethods ?? [];
  const [newMethod, setNewMethod] = useState("");

  // For editing a method in the master list.
  const [editMethodDialogOpen, setEditMethodDialogOpen] = useState(false);
  const [editMethodIndex, setEditMethodIndex] = useState(null);
  const [editMethodName, setEditMethodName] = useState("");

  const handleAddNewMethod = () => {
    if (newMethod.trim()) {
      setPipelineOptions((prev) => ({
        ...prev,
        availableInputMethods: [...(prev.availableInputMethods ?? []), newMethod.trim()],
      }));
      setNewMethod("");
    }
  };

  const handleEditMethod = (index) => {
    setEditMethodIndex(index);
    setEditMethodName(availableMethods[index]);
    setEditMethodDialogOpen(true);
  };

  const handleSaveEditedMethod = () => {
    if (!editMethodName.trim() || editMethodIndex === null) return;
    const oldMethod = availableMethods[editMethodIndex];
    const updatedMethods = availableMethods.map((m, idx) =>
      idx === editMethodIndex ? editMethodName.trim() : m
    );
    // Update objectives that reference the old method.
    setPipelineOptions((prev) => ({
      ...prev,
      availableInputMethods: updatedMethods,
      objectives: (prev.objectives ?? []).map((obj) => ({
        ...obj,
        inputMethods: (obj.inputMethods ?? []).map((m) => (m === oldMethod ? editMethodName.trim() : m)),
      })),
    }));
    setEditMethodDialogOpen(false);
    setEditMethodIndex(null);
    setEditMethodName("");
  };

  const handleDeleteMethod = (index) => {
    const methodToDelete = availableMethods[index];
    const updatedMethods = availableMethods.filter((_, idx) => idx !== index);
    setPipelineOptions((prev) => ({
      ...prev,
      availableInputMethods: updatedMethods,
      objectives: (prev.objectives ?? []).map((obj) => ({
        ...obj,
        inputMethods: (obj.inputMethods ?? []).filter((m) => m !== methodToDelete),
      })),
    }));
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ mb: 2 }}>
        <h3>Input Methods (Master List)</h3>
      </Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="New Input Method"
          value={newMethod}
          size="small"  sx={{ minHeight: "32px", height: "32px", fontSize: "0.75rem" }} 
          onChange={(e) => setNewMethod(e.target.value)}
        />
        <Button variant="contained" size="small"  sx={{ minHeight: "32px", height: "32px", fontSize: "0.75rem" }}  onClick={handleAddNewMethod}>
          Add New Method
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <h4>Available Input Methods:</h4>
        {availableMethods.length > 0 ? (
          availableMethods.map((method, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1,
                borderBottom: "1px solid #ccc",
              }}
            >
              <Box>{method}</Box>
              <Box>
                <Button variant="outlined" size="small" onClick={() => handleEditMethod(idx)} sx={{ mr: 1 }}>
                  Edit
                </Button>
                <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteMethod(idx)}>
                  Delete
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Box>-</Box>
        )}
      </Box>
      <Dialog
        open={editMethodDialogOpen}
        onClose={() => {
          setEditMethodDialogOpen(false);
          setEditMethodIndex(null);
          setEditMethodName("");
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Input Method</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Input Method Name"
            fullWidth
            value={editMethodName}
            onChange={(e) => setEditMethodName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setEditMethodDialogOpen(false);
              setEditMethodIndex(null);
              setEditMethodName("");
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" size="small"  sx={{ minHeight: "32px", height: "32px", fontSize: "0.75rem" }}  onClick={handleSaveEditedMethod}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

// --------------------------------------------------
// Tab 5: Objective Input Methods Management
// --------------------------------------------------
function ObjectiveInputMethodManagement({ pipelineOptions, setPipelineOptions }) {
  // This tab shows a table with all objectives and allows you to edit their inputMethods
  const [openDialog, setOpenDialog] = useState(false);
  const [currentObjective, setCurrentObjective] = useState(null);
  const availableMethods = pipelineOptions.availableInputMethods ?? [];

  const handleOpenEdit = (objective) => {
    setCurrentObjective({ ...objective, inputMethods: objective.inputMethods ?? [] });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (currentObjective) {
      setPipelineOptions((prev) => ({
        ...prev,
        objectives: (prev.objectives ?? []).map((obj) =>
          obj.id === currentObjective.id ? currentObjective : obj
        ),
      }));
    }
    setOpenDialog(false);
    setCurrentObjective(null);
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ mb: 2 }}>
        <h3>Objective Input Methods</h3>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Objective</TableCell>
            <TableCell>Input Methods</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(pipelineOptions.objectives ?? []).map((obj) => (
            <TableRow key={obj.id}>
              <TableCell>{obj.label}</TableCell>
              <TableCell>{(obj.inputMethods ?? []).join(", ") || "-"}</TableCell>
              <TableCell align="right">
                <Button variant="outlined" size="small" onClick={() => handleOpenEdit(obj)}>
                  Edit Input Methods
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {currentObjective && (
        <Dialog open={openDialog} onClose={() => { setOpenDialog(false); setCurrentObjective(null); }} fullWidth maxWidth="sm">
          <DialogTitle>Edit Objective Input Methods</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <InputLabel>Input Methods</InputLabel>
              <Select
                multiple
                value={currentObjective.inputMethods ?? []}
                onChange={(e) =>
                  setCurrentObjective({ ...currentObjective, inputMethods: e.target.value })
                }
                renderValue={(selected) => (selected ?? []).join(", ")}
                label="Input Methods"
              >
                {availableMethods.map((method, idx) => (
                  <MenuItem key={idx} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpenDialog(false); setCurrentObjective(null); }}>Cancel</Button>
            <Button variant="contained" size="small"  sx={{ minHeight: "32px", height: "32px", fontSize: "0.75rem" }}  onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
}
