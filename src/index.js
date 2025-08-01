import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import CloudBot from './pages/CloudBot/CloudBot'
import Products from './pages/CloudBot/Products'
import { AuthProvider } from "./pages/SignIn/SignIn";
import SignIn from './pages/SignIn/SignIn';
import SBCart from './pages/SBCart';
import Folder from './pages/Folder';
import CodeMigrater from './pages/CloudBot/CodeMigrater';
import FolderAnalyzer from './pages/CloudBot/FolderAnalyzer';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import PrimarySearchAppBar from './pages/PrimarySearchAppBar';
import FolderUploader from './pages/CloudBot/FolderUploader';
import VSCodeView from './pages/CloudBot/VSCodeView';
import AnalyticsDashboard from './pages/CloudBot/AnalyticsDashbaord';
import PipelineBuilder from './pages/CloudBot/PipelineBuilder';
import Templates from './pages/CloudBot/Templates';
import CustomModelTrainer from './pages/CloudBot/CustomModelTrainer';
import MigrationWizard from './pages/CloudBot/MigrationWizard';
import PipelineManager from './pages/CloudBot/PipelineManager';
import MigrationVisualizer from './pages/CloudBot/MigrationVisualizer';
import KafkaMigrationApp from './pages/CloudBot/KafkaMigrationApp';
import KafkaMigrationWizard from './pages/CloudBot/KafkaMigrationWizard';
import SecondarySearchAppBar from './pages/SecondarySearchAppBar';
import KafkaComparisonTable from './pages/CloudBot/KafkaComparisonTable';
import SimpleKafkaMigration from './pages/CloudBot/SimpleKafkaMigration';
import SimpleKafkaMigrationNew from './pages/CloudBot/SimpleKafkaMigrationNew';
import VSCodeFileComparison from './pages/CloudBot/VSCodeFileComparison';
import FileComparisonView from './pages/CloudBot/FileComparisonView';
import TemplatesUser from './pages/CloudBot/TemplatesUser';
import PromptManager from './pages/CloudBot/PromptManager';
import ReactCart from './pages/ReactCart';
import ProjectManager from './pages/ProjectManager';
import SBReactGenerator from './pages/SBReactGenerator';


const theme = createTheme();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        <Routes>





          <Route path='/' element={<AuthProvider>
            <SignIn />
          </AuthProvider>} />

        </Routes>
      </Router>




      <Router>
        <Routes>





          <Route path='/cloudbot' element={<><PrimarySearchAppBar /><CloudBot /></>} />
          <Route path='/models' element={<><PrimarySearchAppBar /><CodeMigrater /></>} />
          <Route path='/sbcart' element={<><PrimarySearchAppBar /><SBReactGenerator /></>} />
          <Route path='/createreact' element={<><PrimarySearchAppBar /><ReactCart /></>} />
          <Route path='/folder' element={<><PrimarySearchAppBar /><Folder /></>} />
          <Route path='/projectmigrater' element={<><PrimarySearchAppBar /><FolderAnalyzer /></>} />


          <Route path='/projectmanager' element={<><PrimarySearchAppBar /><ProjectManager /></>} />



          <Route path='/migrate' element={<><PrimarySearchAppBar /><CloudBot /></>} />

          <Route path='/home' element={<><PrimarySearchAppBar /><CloudBot /></>} />

          <Route path='/pipelines' element={<><PrimarySearchAppBar /><PipelineBuilder /></>} />
          <Route path='/products' element={<><PrimarySearchAppBar /><Products /></>} />
          <Route path='/FolderUploader' element={<><PrimarySearchAppBar /><FolderUploader /></>} />
          <Route path='/analytics' element={<><PrimarySearchAppBar /><AnalyticsDashboard /></>} />
          <Route path='/templates' element={<><PrimarySearchAppBar /><Templates /></>} />
          <Route path='/VSCodeView' element={<><PrimarySearchAppBar /><VSCodeView /></>} />

          <Route path='/training' element={<><PrimarySearchAppBar /><CustomModelTrainer /></>} />


          <Route path='/tibcotolamda' element={<><PrimarySearchAppBar /><MigrationWizard /></>} />

          <Route path='/masterdata' element={<><PrimarySearchAppBar /><PipelineManager /></>} />


          <Route path='/visualizer' element={<><PrimarySearchAppBar /><MigrationVisualizer /></>} />



          <Route path='/KafkaMigrationApp' element={<><SecondarySearchAppBar /><KafkaMigrationApp /></>} />


          <Route path='/comparecode/:record_id/:folder' element={<><AuthProvider><SecondarySearchAppBar /><FileComparisonView /></AuthProvider></>} />


          <Route path='/Distributions' element={<><AuthProvider><SecondarySearchAppBar /></AuthProvider><KafkaComparisonTable /></>} />
          <Route path='/Advanced' element={<><AuthProvider><SecondarySearchAppBar /></AuthProvider><KafkaMigrationWizard /></>} />
          <Route path='/KafkaMigrationOld' element={<><AuthProvider><SecondarySearchAppBar /></AuthProvider><SimpleKafkaMigration /></>} />
          <Route path='/KafkaMigration' element={<><AuthProvider><SecondarySearchAppBar /></AuthProvider><SimpleKafkaMigrationNew /></>} />
          {/* <Route path='/compare/:record_id' element={<><AuthProvider><SecondarySearchAppBar /></AuthProvider><VSCodeFileComparison /></>} /> */}
          {/* <Route path='/comparecode/:record_id/:folder' element={<><AuthProvider><SecondarySearchAppBar /></AuthProvider><FileComparisonView /></>} /> */}

          <Route path='/PromptManager' element={<><AuthProvider><PrimarySearchAppBar /></AuthProvider><PromptManager /></>} />

          <Route path='/UseTemplates/:search' element={<><AuthProvider><SecondarySearchAppBar /></AuthProvider><TemplatesUser /></>} />

        </Routes>
      </Router>

    </ThemeProvider>
  </React.StrictMode>
);
