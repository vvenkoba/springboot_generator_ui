import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Checkbox,
  Grid,
} from '@mui/material';
import { CheckBoxOutlineBlank, CheckBox } from '@mui/icons-material';

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

// Define category-wise options
const techOptions = {

  DevOps: [
    { title: 'Jenkins', group: 'CI/CD' },
    { title: 'GitHub Actions', group: 'CI/CD' },
    { title: 'GitLab CI', group: 'CI/CD' },
    { title: 'Docker', group: 'Containerization' },
    { title: 'Kubernetes', group: 'Containerization' },
    { title: 'Helm', group: 'Kubernetes Tooling' },
    { title: 'Terraform', group: 'IaC' },
    { title: 'Ansible', group: 'IaC' },
  ],
  Cloud: [
    { title: 'AWS S3', group: 'AWS' },
    { title: 'AWS EC2', group: 'AWS' },
    { title: 'Azure Blob Storage', group: 'Azure' },
    { title: 'Google GCS', group: 'GCP' },
    { title: 'Cloud Foundry', group: 'Platform' },
    { title: 'Heroku', group: 'Platform' },
  ],



  Environments: [
    { title: 'Development', group: 'Env Type' },
    { title: 'IT1', group: 'Testing' },
    { title: 'IT2', group: 'Testing' },
    { title: 'UAT1', group: 'UAT' },
    { title: 'Production', group: 'Prod' },
  ],

  Scans: [
    { title: 'ZAP Proxy', group: 'Security' },
    { title: 'Fortify', group: 'Security' },
    { title: 'BlackDuck', group: 'Security' },
    { title: 'Twistlock', group: 'Security' },
    { title: 'FOSSA', group: 'Security' },
    { title: 'OWASP Top 10', group: 'Security' },
    { title: 'SonarQube', group: 'CodeQuality' },
    { title: 'JMeter', group: 'Performance' },
    { title: 'Custom SAST', group: 'Other' },
    { title: 'Dependency Check', group: 'Other' },
  ],



  LoadBalancers: [
    { title: 'NGINX', group: 'Software LB' },
    { title: 'HAProxy', group: 'Software LB' },
    // { title: 'F5 BIG-IP', group: 'Enterprise Appliances' },
    { title: 'AWS ELB', group: 'Cloud Load Balancers' },
    { title: 'Azure Load Balancer', group: 'Cloud Load Balancers' },
    { title: 'Google Cloud Load Balancer', group: 'Cloud Load Balancers' },
  ],
  DeploymentStrategies: [
    { title: 'Rolling Deployment', group: 'Release Pattern' },
    { title: 'Blue-Green Deployment', group: 'Release Pattern' },
    { title: 'Canary Deployment', group: 'Release Pattern' },
    { title: 'Recreate Deployment', group: 'Release Pattern' },
    { title: 'Shadow Deployment', group: 'Release Pattern' },
    { title: 'Helm', group: 'Orchestration Tools' },
    { title: 'Kustomize', group: 'Orchestration Tools' },
    { title: 'Argo Rollouts', group: 'Orchestration Tools' },
    { title: 'Spinnaker Strategies', group: 'Orchestration Tools' },
    { title: 'Staging First', group: 'Environment Targeting' },
    { title: 'Production Direct', group: 'Environment Targeting' },
    { title: 'Feature Toggles (LaunchDarkly)', group: 'Environment Targeting' },
    { title: 'Feature Toggles (Unleash)', group: 'Environment Targeting' },
  ],

  Monitoring: [
    { title: 'Prometheus + Grafana', group: 'Metrics' },
    { title: 'ELK Stack', group: 'Logs' },
    { title: 'Micrometer', group: 'Tracing' },
  ],

  NotificationAndAlerting: [
    { title: 'Slack', group: 'ChatOps' },
    { title: 'Microsoft Teams', group: 'ChatOps' },
    // { title: 'Discord', group: 'ChatOps' },
    // { title: 'PagerDuty', group: 'Incident Management' },
    // { title: 'Opsgenie', group: 'Incident Management' },
    { title: 'Splunk On-Call (VictorOps)', group: 'Incident Management' },
    { title: 'SMTP Mailer', group: 'Email & System' },
    { title: 'SES (AWS)', group: 'Email & System' },
    { title: 'Webhooks', group: 'Email & System' },
    { title: 'Prometheus Alertmanager', group: 'Observability Alerts' },
    { title: 'Grafana Alerts', group: 'Observability Alerts' },
    // { title: 'Datadog', group: 'Observability Alerts' },
    { title: 'New Relic', group: 'Observability Alerts' },
    // { title: 'Sentry', group: 'Observability Alerts' },
  ],


};

const MultiSelectAutocomplete = ({ label, options }) => (
  <Autocomplete
    multiple
    disableCloseOnSelect
    options={options.sort((a, b) => a.group.localeCompare(b.group))}
    groupBy={(option) => option.group}
    getOptionLabel={(option) => option.title}
    renderOption={(props, option, { selected }) => (
      <li {...props}>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selected}
        />
        {option.title}
      </li>
    )}
    renderInput={(params) => (
      <TextField {...params} label={label} placeholder={label} />
    )}
    sx={{ width: '100%' }}
  />
);

export default function ReactSourceForm() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {Object.entries(techOptions).map(([category, options]) => (
          <Grid item xs={12} sm={6} key={category}>
            <Typography variant="subtitle1" gutterBottom>
              {category}
            </Typography>
            <MultiSelectAutocomplete label={category} options={options} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
