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
  Databases: [
    { title: 'MySQL', group: 'SQL' },
    { title: 'PostgreSQL', group: 'SQL' },
    { title: 'Oracle', group: 'SQL' },
    { title: 'Microsoft SQL Server', group: 'SQL' },
    { title: 'MongoDB', group: 'NoSQL' },
    { title: 'Cassandra', group: 'NoSQL' },
    { title: 'Couchbase', group: 'NoSQL' },
    { title: 'Redis', group: 'NoSQL' },
    { title: 'Neo4j', group: 'NoSQL' },
    { title: 'H2', group: 'Embedded' },
    { title: 'Derby', group: 'Embedded' },
  ],

  AuthMechanism: [
    { title: 'OAuth2', group: 'Spring Security' },
    { title: 'JWT', group: 'Spring Security' },
    { title: 'LDAP', group: 'Integrations' },
    { title: 'Keycloak', group: 'Identity Providers' },
    { title: 'Auth0', group: 'Identity Providers' },
  ],

  Messaging: [
    { title: 'Kafka', group: 'Messaging' },
    { title: 'RabbitMQ', group: 'Messaging' },
    // { title: 'Spring Integration', group: 'Integration' },
  ],
  CloudServices: [
    { title: 'Lambda', group: 'AWS' },
    { title: 'Step Functions', group: 'AWS' },
    { title: 'DynamoDB', group: 'AWS' },
    { title: 'RDS', group: 'AWS' },
    { title: 'SQS', group: 'AWS' },
    { title: 'Azure Functions', group: 'Azure' },
    { title: 'Azure Durable Functions', group: 'Azure' },
    { title: 'Cosmos DB', group: 'Azure' },
    { title: 'Azure SQL Database', group: 'Azure' },
    { title: 'Azure Service Bus', group: 'Azure' },
    { title: 'Cloud Functions', group: 'GCP' },
    { title: 'GCP Workflows', group: 'GCP' },
    { title: 'Firestore', group: 'GCP' },
    { title: 'Cloud SQL', group: 'GCP' },
    { title: 'Pub/Sub', group: 'GCP' },
  ],

  KafkaStack: [
    { title: 'Kafka Broker', group: 'Kafka Core' },
    { title: 'Producer', group: 'Kafka Core' },
    { title: 'Consumer', group: 'Kafka Core' },
    { title: 'Topics', group: 'Kafka Core' },
    { title: 'Schema Registry', group: 'Kafka Ecosystem' },
  ],


  Logging: [
    { title: 'Log4j', group: 'Java' },
    { title: 'SLF4J', group: 'Java' },
    { title: 'Logback', group: 'Java' },
  ],

  APIGateways: [
    { title: 'Spring Cloud Gateway', group: 'Spring' },
    { title: 'Zuul', group: 'Spring' },
    { title: 'Kong', group: 'Open Source' },
    { title: 'API Gateway (AWS)', group: 'Cloud Managed' },
    { title: 'Apigee', group: 'Cloud Managed' },
  ],

  APIClients: [
    { title: 'RestTemplate', group: 'Spring' },
    { title: 'WebClient', group: 'Spring' },
    { title: 'Feign Client', group: 'Declarative' },
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
