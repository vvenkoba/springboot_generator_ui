import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PrimarySearchAppBar from './PrimarySearchAppBar';
import ReactProjectForm from './ReactProjectForm';
import ReactCDForm from './ReactCDForm';
import ReactReview from './ReactReview';
import Folder from './Folder'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import ReactSourceForm from './ReactSourceForm';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        CodeMigrator
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const steps = ['React JS Project', 'Configurations', 'CI-CD Config', 'Review and Download'];

function getStepContent(step) {
  switch (step) {

    case 0:
      return <ReactProjectForm />;
    case 1:
      return <ReactSourceForm />;
    case 2:
      return <ReactCDForm />;
    case 3:
      return <ReactReview />;
    default:
      throw new Error('Unknown step');
  }
}

const theme = createTheme();

export default function ReactCart() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleDownload = () => {
    const url = '/codemigrater-struts-to-springboot.zip';
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('springboot', `${Date.now()}.png`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const handleNext = () => {
    let isChecked = "true";
    if (localStorage.getItem('checked')) {
      isChecked = localStorage.getItem('checked');
      if (isChecked == "true") {
        setActiveStep(activeStep + 1);
      } else {
        setActiveStep(activeStep + 1);
      }
    } else {
      setActiveStep(activeStep + 1);
    }
    if (activeStep == 3) {
      //checkin and navigate to git repo
      window.open("https://dev.azure.com/2055776/_git/CloudSquadAnalyzer", '_blank').focus();

    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleHome = () => {
    window.location.href = "/cloudbot"
  };
  return (
    <>

      {/* <AppBar position="relative">
        <Toolbar>
        <CloudDoneIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
          CodeMigrator
          </Typography>
        </Toolbar>
      </AppBar> */}
      {/* <PrimarySearchAppBar/> */}
      <Container component="main" maxWidth="md" sx={{ mb: 6 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            React JS Boilerplate Code Generator
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <LinearProgressWithLabel value={activeStep == 0 ? 25 : activeStep == 1 ? 50 : activeStep == 2 ? 75 : 100} />

          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you using CodeMigrator.
              </Typography>
              <Typography variant="subtitle1">
                Your project will start downloading now. Goto ELK to monitor your application logs.
              </Typography>


            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                {activeStep === 0 && (
                  <Button onClick={handleHome} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}


                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    Project Code Checkin
                  </Button>
                )
                  : (<></>)}


                <Button
                  variant="contained"
                  onClick={activeStep === steps.length - 1 ? handleDownload : handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? 'Download Project' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>


      </Container>


      {/* <Container component="main" maxWidth="90%" sx={{ mb: 8 }}>
      {activeStep == 2 && (
        <Folder/>
        )}
        </Container> */}


      <Copyright />
    </>
  );
}
