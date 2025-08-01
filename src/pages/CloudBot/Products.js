import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainFeaturedPost from '../MainFeaturedPost'
import PrimarySearchAppBar from '../PrimarySearchAppBar'
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        CodeMigrator
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme();

export default function Products() {


  const searchKeywords = [
    { title: "Spring Boot REST API", redirectURL: "/sbcart" },

    { title: "Kafka", redirectURL: "/error" },

    { title: "AWS -Lamda", redirectURL: "/error" },
    { title: "API Management", redirectURL: "/error" },
    { title: "C# .Net API", redirectURL: "/error" },

    { title: "GraphQL API", redirectURL: "/error" },
    { title: "Azure - Functions", redirectURL: "/error" },
    { title: "Java VertX ", redirectURL: "/error" },
    { title: "Spring Boot REST (Batch)", redirectURL: "/error" },

    { title: "ReactJS ", redirectURL: "/error" },
    { title: "NodeJS", redirectURL: "/error" },
    { title: "Angular", redirectURL: "/error" },
    { title: "Python", redirectURL: "/error" },

    { title: "Spring Framework", redirectURL: "/sbcart" },
    { title: "Spring Data", redirectURL: "/sbcart" },
    { title: "Spring Cloud", redirectURL: "/sbcart" },
    { title: "Spring Cloud Data Flow", redirectURL: "/sbcart" },
    { title: "Spring Security", redirectURL: "/sbcart" },
    { title: "Spring for GraphQL", redirectURL: "/sbcart" },
    { title: "Spring AMQP", redirectURL: "/sbcart" },
    { title: "Spring for Apache Kafka", redirectURL: "/sbcart" },
    { title: "Spring Vault", redirectURL: "/sbcart" },
    { title: "Spring Web Services", redirectURL: "/sbcart" },
  ];


  const cards = [
    { title: "Spring Boot REST API", description: "Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can 'just run'", image_name: "springboot.png" },
    { title: "Kafka", description: "Distributed event streaming platform used for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications", image_name: "kafka.png" },
    { title: "AWS -Lamda", description: "AWS Lambda is a computing service that runs code in response to events and automatically manages the computing resources required by that code.", image_name: "awslamda.png" },
    { title: "Tibco", description: "TIBCO providing enterprise software and solutions, primarily focused on data integration, analytics, and real-time data streaming", image_name: "tibco.png" },

    { title: "API Management", description: "Benefit organizations by centralizing control over their API integrations while ensuring they continuously meet high performance and security standards.", image_name: "apigateway.png" },
    { title: "C# .Net API", description: "REST APIs with .NET and C# makes it easy to build services that reach a broad range of clients, including browsers and mobile devices.", image_name: "dotnet.png" },

    { title: "GraphQL API", description: "GraphQL is an open-source data query and manipulation language for APIs, and a runtime for fulfilling queries with existing data.", image_name: "graphql.png" },
    { title: "Azure - Functions", description: "Azure Functions is a serverless solution that allows you to write less code, maintain less infrastructure, and save on costs.", image_name: "azurefunctions.png" },
    { title: "Java VertX ", description: "Eclipse Vert.x is a polyglot event-driven application framework that runs on the Java Virtual Machine.", image_name: "vertx.png" },
    { title: "Spring Boot REST (Batch)", description: "Processing large volumes, logging, transaction management, job processing statistics, job restart, skip, and resource management.", image_name: "sbbatch.png" },

    { title: "ReactJS ", description: "React makes it painless to create interactive UIs.Build encapsulated components that manage their own state, then compose them to make complex UIs.", image_name: "reactjs.png" },
    { title: "NodeJS", description: "NodeJS is used for server-side programming, and primarily deployed for non-blocking, event-driven servers, such as traditional web sites and back-end API services", image_name: "nodejs.png" },
    { title: "Angular", description: "Angular is a platform and framework for building single-page client applications using HTML and TypeScript for building mobile and desktop web applications", image_name: "angular.png" },
    { title: "Python", description: "Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation.", image_name: "python.png" }
  ];


  const mainFeaturedPost = {
    title: 'Code Migrater - Bridge for legacy to modern',
    description: "Transform your legacy codebase into modern solutions with ease! Code Migrator is a powerful code migration tool designed to automate the transformation of applications from one programming language or framework to another. By analyzing legacy code, restructuring it, and adapting it to modern standards, Code Migrator streamlines the modernization process while preserving functionality and integrity. Perfect for upgrading from outdated technologies to cutting-edge platforms, Code Migrater accelerates digital transformation, reduces manual effort, and ensures high-quality, future-proof code.",
    image: '../cloudcomputing.jpg',
    imageText: 'CodeMigrator',
    linkText: 'Lets Begin',
  };


  const [value, setValue] = React.useState("");
  const [message, setMessage] = React.useState("This project is not yet added");
  const [severity, setSeverity] = React.useState("warning");

  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>


      <main>



        <Container sx={{ py: 8 }} maxWidth="lg">

          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
              {message}
            </Alert>
          </Snackbar>


          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card.title} xs={12} sm={6} md={2}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
                    height="150" width="150"
                    image={card.image_name}
                    alt="random"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h5">
                      {card.title}
                    </Typography>
                    {/* {card.description} */}
                  </CardContent>
                  <CardActions>
                    <Button size="small">
                      <Link color="inherit" href="/migrate">
                        Migrate
                      </Link>{' '}
                    </Button>
                    <Button size="small">Download</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          CodeMigrator
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Help?
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </>
  );
}