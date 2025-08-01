import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const kafkaData = [
  { name: "Apache Kafka (Open Source)", management: "Self-managed", scalability: "High, but requires manual tuning", security: "Basic security (SASL, ACLs, TLS)", pricing: "Free (Open Source)" },
  { name: "Confluent Kafka", management: "Managed & Self-managed options", scalability: "Enterprise-level scalability", security: "Advanced security (RBAC, audit logs, encryption)", pricing: "Subscription-based" },
  { name: "Azure HDInsight Kafka", management: "Fully Managed", scalability: "Scales with Azure resources", security: "Azure security & Active Directory", pricing: "Pay-as-you-go" },
  { name: "Amazon MSK", management: "Fully Managed", scalability: "Auto-scaling with AWS", security: "IAM-based security, VPC isolation", pricing: "Pay-as-you-go" },
  { name: "Red Hat AMQ Streams", management: "Self-managed for Kubernetes/OpenShift", scalability: "Optimized for containerized environments", security: "Secure, policy-based access control", pricing: "Enterprise licensing" },
  { name: "IBM Event Streams", management: "Managed & Self-managed options", scalability: "High scalability for hybrid cloud", security: "Enterprise-grade encryption & access control", pricing: "Subscription-based" },
  { name: "Cloudera Kafka", management: "Self-managed, optimized for big data", scalability: "Tailored for Hadoop ecosystems", security: "Strong governance & security policies", pricing: "Enterprise licensing" },
  { name: "Aiven Kafka", management: "Fully Managed (multi-cloud support)", scalability: "Auto-scalable across cloud providers", security: "Built-in security features", pricing: "Subscription-based" }
];

const KafkaComparisonTable = () => {
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: "auto", mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Kafka Distribution</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Management Type</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Scalability</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Security Features</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Pricing Model</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {kafkaData.map((row, index) => (
            <TableRow key={index} hover>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.management}</TableCell>
              <TableCell>{row.scalability}</TableCell>
              <TableCell>{row.security}</TableCell>
              <TableCell>{row.pricing}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default KafkaComparisonTable;
