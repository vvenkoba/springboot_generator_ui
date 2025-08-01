import React from "react";
import ReactDOM from "react-dom";
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Typography from '@mui/material/Typography';
import { v1 as uuid } from "uuid";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DescriptionIcon from "@mui/icons-material/Description";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { AppBar, Grid, Paper, Toolbar } from "@mui/material";
import CloudDoneIcon from '@mui/icons-material/CloudDone';
// import PrimarySearchAppBar from './PrimarySearchAppBar';

const getTreeItemsFromData = treeItems => {
    return treeItems.map(treeItemData => {
        let children = undefined;
        if (treeItemData.children && treeItemData.children.length > 0) {
            children = getTreeItemsFromData(treeItemData.children);
            return (
                <TreeItem
                    key={treeItemData.id}
                    nodeId={treeItemData.id}
                    label={treeItemData.name}
                    children={children}
                />
            );
        }
        return (
            <TreeItem
                key={treeItemData.id}
                nodeId={treeItemData.id}
                label={<>
                    <DescriptionIcon color="warning" fontSize="small" />
                    {treeItemData.name}
                </>}
                children={children}
            />
        );
    });
};
const DataTreeView = ({ treeItems }) => {

    const code = `package com.java.kafka.config;

    import java.util.HashMap;
    import java.util.Map;
    
    import org.apache.kafka.clients.consumer.ConsumerConfig;
    import org.apache.kafka.common.serialization.StringDeserializer;
    import org.springframework.boot.autoconfigure.kafka.ConcurrentKafkaListenerContainerFactoryConfigurer;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.kafka.annotation.EnableKafka;
    import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
    import org.springframework.kafka.core.ConsumerFactory;
    import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
    
    
    @EnableKafka
    @Configuration
    public class KafkaConsumerConfig {
    
        
        @Bean
        public ConsumerFactory<String, String> consumerFactory()
        {
            Map<String, Object> map = new HashMap<>();
             map.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "");
                map.put(ConsumerConfig.GROUP_ID_CONFIG, "");
                map.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
                map.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
                //put whatever properties you want to set here
                return new DefaultKafkaConsumerFactory<>(map);
        }
        
        
        
        @Bean
        ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory()
        {
            Integer concurrency = 1;
            ConcurrentKafkaListenerContainerFactory<String, String> containerFactory = new ConcurrentKafkaListenerContainerFactory<>();
            containerFactory.setConsumerFactory(consumerFactory());
            containerFactory.setConcurrency(concurrency);
            //can add multiple dependencies here
            return containerFactory;
        }
    }`
    return (
        <>

            {/* <PrimarySearchAppBar/> */}

            {/* <AppBar position="relative">
        <Toolbar>
          <CloudDoneIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
          CodeMigrator
          </Typography>
        </Toolbar>
      </AppBar> */}

            <Grid container spacing={2} >
                <Grid container item xs={6} direction="column" >

                    <TreeView
                        defaultCollapseIcon={<DriveFolderUploadIcon color="success" fontSize="small" />}
                        defaultExpandIcon={<DriveFolderUploadIcon color="primary" fontSize="small" />}
                        expanded={["1", "2", "3", "4", "5", "6", "7", "8", "9"]}
                    >
                        {getTreeItemsFromData(treeItems)}
                    </TreeView>

                </Grid>
                <Grid container item xs={6} direction="column">
                    {/* <Paper style={{maxHeight: "525px",maxWidth: "95%", overflow: 'auto'}}> */}
                    {/* <pre>
                <code>
                     {code}
                </code>
            </pre> */}

                    <TextareaAutosize
                        maxRows={4}
                        placeholder="Write your code here"
                        defaultValue={code}
                        style={{ width: "95%", height: "525px" }}
                    />
                    {/* </Paper> */}

                </Grid>
            </Grid>



        </>
    );
};

const projectStructure = [
    {
        id: "1",
        name: "SpringBootApacheKafkaExample",

        children: [
            { id: uuid(), name: ".classpath" },
            { id: uuid(), name: ".project" },
            { id: uuid(), name: "pom.xml" },
            { id: uuid(), name: "target" },
            {
                id: "2", name: ".settings",
                children: [{ id: uuid(), name: "org.eclipse.jdt.core.prefs" },
                { id: uuid(), name: "org.eclipse.m2e.core.prefs" },
                { id: uuid(), name: "org.springframework.ide.eclipse.prefs" }]
            },

            {
                id: "3", name: "src",
                children: [{
                    id: "4", name: "main", children: [{ id: uuid(), name: "resources", children: [{ id: uuid(), name: "Application.properties" }] },
                    {
                        id: "5", name: "java", children: [{
                            id: "7", name: "com.java.kafka",
                            children: [{ id: uuid(), name: "SpringBootSampleKafkaConsumerApplication.java" },

                            { id: "9", name: "service", children: [{ id: uuid(), name: "kafkaServiceAPI.java" }] },

                            {
                                id: "6", name: "config", children: [
                                    { id: uuid(), name: "KafkaConsumerConfig.java" },
                                    { id: uuid(), name: "KafkaProducerConfig.java" }
                                ]
                            },


                            { id: "8", name: "controller", children: [{ id: uuid(), name: "ApacheKafkaWebController.java" }] }]

                        }]

                    }]
                },
                    // { id: uuid(), name: "test" }
                ]
            },


        ]
    }
];



function Folder() {
    return (
        <div className="App">
            <DataTreeView treeItems={projectStructure} />
        </div>
    );
}

export default Folder;