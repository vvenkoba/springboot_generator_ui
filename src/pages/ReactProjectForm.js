import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { MenuItem, Select } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';

export default function ReactProjectForm() {


  const handleChange = event => {
    localStorage.setItem('checked', event.target.checked);
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Project Creation Input
      </Typography>
      <Grid container spacing={3}>

        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Project Name: "
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Version (Eg. 0.1.0)"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel id="Containerization">Containerization</InputLabel>
          <Select fullWidth
            labelId="Containerization"
            id="Containerization"
            label="Containerization"
            defaultValue={0}
          >
            <MenuItem value={0}>-- Select --</MenuItem>
            <MenuItem value={1}>Yes</MenuItem>
            <MenuItem value={2}>No</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel id="packaging">Packaging</InputLabel>
          <Select fullWidth
            labelId="packaging"
            id="Packaging"
            label="Packaging"
            defaultValue={1}
          >
            <MenuItem value={1}>Application Packaging</MenuItem>
            <MenuItem value={2}>Library Packaging</MenuItem>
            <MenuItem value={3}>Monorepo Packaging</MenuItem>


          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>

          <InputLabel id="java-version">JavaScript Version</InputLabel>
          <Select fullWidth
            labelId="java-version"
            id="JavaScript version"
            label="JavaScript version"
            defaultValue="9"
          >
            <MenuItem value={5}>ES5 ECMA 262 Edition 5 (2009)</MenuItem>
            <MenuItem value={6}>ES6 ECMA 2015</MenuItem>
            <MenuItem value={7}>ES7 ECMA 2016</MenuItem>
            <MenuItem value={8}>ES8 ECMA 2017</MenuItem>
            <MenuItem value={9}>ES9 ECMA 2018</MenuItem>
            <MenuItem value={10}>ES10 ECMA 2019</MenuItem>
            <MenuItem value={11}>ES11 ECMA 2020</MenuItem>
            <MenuItem value={12}>ES12 ECMA 2021</MenuItem>
            <MenuItem value={13}>ES13 ECMA 2022</MenuItem>
            <MenuItem value={14}>ES14 ECMA 2023</MenuItem>
            <MenuItem value={15}>ES15 ECMA 2024</MenuItem>
          </Select>
        </Grid>

        {/*  <Grid item xs={12} sm={6}>

          <InputLabel id="java-version">CICD Tools</InputLabel>
       <Select fullWidth
           labelId="cicd"
           id="cicd"
           label="cicd"
           defaultValue="0"
         >
          <MenuItem value={0}> -- Select --</MenuItem>
           <MenuItem value={1}>Jenkins</MenuItem>
           <MenuItem value={2}>Circle CI</MenuItem>
           <MenuItem value={3}>Bamboo</MenuItem>
           <MenuItem value={4}>Git Actions</MenuItem>
           <MenuItem value={5}>AzureDevops</MenuItem>
         </Select>
               </Grid> */}

        {/* <Grid item xs={12} sm={6}>
       
       <InputLabel id="java-version">Build Tools</InputLabel>
       <Select fullWidth
           labelId="buildtool"
           id="buildtool"
           label="buildtool"
           defaultValue="0"
         >
          <MenuItem value={0}> -- Select --</MenuItem>
           <MenuItem value={1}>Maven</MenuItem>
           <MenuItem value={2}>Gradle</MenuItem>
           <MenuItem value={3}>Ant</MenuItem>
         </Select>
               </Grid> */}


        <Grid item xs={12} sm={6}>

          <InputLabel id="coderepo">Code Repository</InputLabel>
          <Select fullWidth
            labelId="coderepo"
            id="coderepo"
            label="coderepo"
            defaultValue="0"
          >
            <MenuItem value={0}>-- Select --</MenuItem>
            <MenuItem value={1}>Git Hub</MenuItem>
            <MenuItem value={2}>Bit Bucket</MenuItem>
            <MenuItem value={3}>Git Lab</MenuItem>
            <MenuItem value={4}>Azure Devops</MenuItem>
            <MenuItem value={5}>AWS Code Commit</MenuItem>
            <MenuItem value={6}>GCP Cloud Source Repositories</MenuItem>
            <MenuItem value={7}>Upload From Local Drive</MenuItem>
          </Select>
        </Grid>


        <Grid item xs={12}>
          <TextField
            required
            id="codeurl"
            name="codeurl"
            label="Code Repository Path "
            fullWidth
            autoComplete="family-name"
            variant="standard"
          />
        </Grid>


        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="cicdCheck" defaultChecked="yes" value="true" onChange={handleChange} />}
            label="Would like to have CI-CD Configurations?"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
