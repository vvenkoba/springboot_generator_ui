import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import axios from 'axios';
import { Download, Loader2, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';


function SBReactGenerator() {
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ['Basic Project Information', 'Entity Fields', 'Features & Integrations', 'Review & Download'];
  const { register, handleSubmit, control, watch, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: {
      entityName: '',
      description: '',
      groupId: 'com.example',
      artifactId: '',
      projectName: '',
      version: '1.0.0',
      packaging: 'jar',
      javaVersion: '11',
      database: [],
      messaging: [],
      streaming: [],
      environments: [],
      containerization: [],
      repository: [],
      security: [],
      logging: [],
      aws: [],
      testing: [],
      scanning: [],
      monitoring: [],
      fields: []
    }
  });

  const watchedFields = watch();

  useEffect(() => {
    setSuccess(false)
    setError(null)
    fetchOptions();
  //   setOptions({
  //     "databases": [
  //         "h2",
  //         "mysql",
  //         "mongo"
  //     ],
  //     "environments": [
  //         "dev",
  //         "e2e",
  //         "stage",
  //         "prod"
  //     ],
  //     "scanning": [
  //         "static-analysis",
  //         "security-scanning",
  //         "code-quality",
  //         "dependency-scanning"
  //     ],
  //     "testing": [
  //         "mockito",
  //         "junit5"
  //     ],
  //     "packaging": [
  //         "jar",
  //         "war"
  //     ],
  //     "repository": [
  //         "git",
  //         "github-actions",
  //         "gitlab-ci",
  //         "jenkins",
  //         "bitbucket-pipelines",
  //         "sonarqube",
  //         "codecov"
  //     ],
  //     "monitoring": [
  //         "actuator",
  //         "prometheus",
  //         "grafana",
  //         "micrometer",
  //         "health-checks",
  //         "metrics",
  //         "tracing",
  //         "distributed-tracing",
  //         "apm",
  //         "alerting",
  //         "dashboard"
  //     ],
  //     "messaging": [
  //         "activemq",
  //         "rabbitmq"
  //     ],
  //     "containerization": [
  //         "docker",
  //         "docker-compose",
  //         "kubernetes"
  //     ],
  //     "streaming": [
  //         "kafka",
  //         "pulsar"
  //     ],
  //     "security": [
  //         "spring-security",
  //         "jwt",
  //         "oauth2",
  //         "ldap",
  //         "basic-auth",
  //         "form-login",
  //         "remember-me",
  //         "csrf",
  //         "cors"
  //     ],
  //     "fieldTypes": [
  //         "String",
  //         "Integer",
  //         "Long",
  //         "Double",
  //         "BigDecimal",
  //         "Boolean",
  //         "LocalDate",
  //         "LocalDateTime"
  //     ],
  //     "logging": [
  //         "logback",
  //         "log4j2",
  //         "slf4j",
  //         "structured-logging",
  //         "json-logging",
  //         "async-logging",
  //         "log-aggregation"
  //     ],
  //     "javaVersions": [
  //         "11",
  //         "17",
  //         "21"
  //     ],
  //     "aws": [
  //         "s3",
  //         "sqs"
  //     ]
  // })
  }, []);

  function toTitleCase(str){
    return str.charAt(0).toUpperCase() + str.substring(1)
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Project Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entity Name *
              </label>
              <input
                type="text"
                {...register('entityName', { required: 'Entity name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., User, Product, Order"
              />
              {errors.entityName && (
                <p className="mt-1 text-sm text-red-600">{errors.entityName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                {...register('projectName', { required: 'Project name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., User Management Service"
              />
              {errors.projectName && (
                <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Brief description of your project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artifact ID *
              </label>
              <input
                type="text"
                {...register('artifactId', { required: 'Artifact ID is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., user-service"
              />
              {errors.artifactId && (
                <p className="mt-1 text-sm text-red-600">{errors.artifactId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group ID
              </label>
              <input
                type="text"
                {...register('groupId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., com.example"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Version
              </label>
              <input
                type="text"
                {...register('version')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 1.0.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Java Version
              </label>
              <select
                {...register('javaVersion')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="11">Java 11</option>
                <option value="17">Java 17</option>
                <option value="21">Java 21</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Packaging
              </label>
              <select
                {...register('packaging')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="jar">JAR</option>
                <option value="war">WAR</option>
              </select>
            </div>
          </div>
        </div>;
      case 1:
        return <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Entity Fields</h2>
            <button
              type="button"
              onClick={addField}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </button>
          </div>

          {(watchedFields.fields || []).map((field, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Name
                </label>
                <input
                  type="text"
                  value={field.name || ''}
                  onChange={(e) => updateField(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., name, email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={field.type || 'String'}
                  onChange={(e) => updateField(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {fieldTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={field.required || false}
                    onChange={(e) => updateField(index, 'required', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Required</span>
                </label>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </button>
              </div>
            </div>
          ))}

          {(watchedFields.fields || []).length === 0 && (
            <p className="text-gray-500 text-center py-8">No fields added yet. Click "Add Field" to get started.</p>
          )}
        </div>;
      case 2:
        return <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Features & Integrations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Database */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Database</label>
              <Controller
                name="database"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={options.databases?.map(db => ({ value: db, label: db.toUpperCase() })) || []}
                    value={field.value?.map(db => ({ value: db, label: db.toUpperCase() })) || []}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </div>

            {/* Messaging */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Messaging</label>
              <Controller
                name="messaging"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={options.messaging?.map(msg => ({ value: msg, label: msg.toUpperCase() })) || []}
                    value={field.value?.map(msg => ({ value: msg, label: msg.toUpperCase() })) || []}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </div>

            {/* Streaming */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Streaming</label>
              <Controller
                name="streaming"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={options.streaming?.map(stream => ({ value: stream, label: stream.toUpperCase() })) || []}
                    value={field.value?.map(stream => ({ value: stream, label: stream.toUpperCase() })) || []}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </div>

            {/* AWS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">AWS Services</label>
              <Controller
                name="aws"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={options.aws?.map(service => ({ value: service, label: service.toUpperCase() })) || []}
                    value={field.value?.map(service => ({ value: service, label: service.toUpperCase() })) || []}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </div>

            {/* Security */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Security</label>
              <Controller
                name="security"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={options.security?.map(sec => ({ value: sec, label: sec.replace('-', ' ').toUpperCase() })) || []}
                    value={field.value?.map(sec => ({ value: sec, label: sec.replace('-', ' ').toUpperCase() })) || []}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </div>

            {/* Logging */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logging</label>
              <Controller
                name="logging"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={options.logging?.map(log => ({ value: log, label: log.replace('-', ' ').toUpperCase() })) || []}
                    value={field.value?.map(log => ({ value: log, label: log.replace('-', ' ').toUpperCase() })) || []}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </div>

            {/* Environments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Environments</label>
              <Controller
                name="environments"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={options.environments?.map(env => ({ value: env, label: env.toUpperCase() })) || []}
                    value={field.value?.map(env => ({ value: env, label: env.toUpperCase() })) || []}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </div>

            {/* Containerization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Containerization</label>
              <Controller
                name="containerization"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={options.containerization?.map(cont => ({ value: cont, label: cont.replace('-', ' ').toUpperCase() })) || []}
                    value={field.value?.map(cont => ({ value: cont, label: cont.replace('-', ' ').toUpperCase() })) || []}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </div>

            {/* Repository Integration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Repository Integration</label>
              <Controller
                name="repository"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={options.repository?.map(repo => ({ value: repo, label: repo.replace('-', ' ').toUpperCase() })) || []}
                    value={field.value?.map(repo => ({ value: repo, label: repo.replace('-', ' ').toUpperCase() })) || []}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </div>

            {/* Testing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Testing Framework</label>
              <Controller
                name="testing"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={options.testing?.map(test => ({ value: test, label: test.replace('-', ' ').toUpperCase() })) || []}
                    value={field.value?.map(test => ({ value: test, label: test.replace('-', ' ').toUpperCase() })) || []}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </div>

            {/* Scanning */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Code Scanning</label>
              <Controller
                name="scanning"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={options.scanning?.map(scan => ({ value: scan, label: scan.replace('-', ' ').toUpperCase() })) || []}
                    value={field.value?.map(scan => ({ value: scan, label: scan.replace('-', ' ').toUpperCase() })) || []}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </div>

            {/* Monitoring */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monitoring & Observability</label>
              <Controller
                name="monitoring"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={options.monitoring?.map(monitor => ({ value: monitor, label: monitor.replace('-', ' ').toUpperCase() })) || []}
                    value={field.value?.map(monitor => ({ value: monitor, label: monitor.replace('-', ' ').toUpperCase() })) || []}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                  />
                )}
              />
            </div>
          </div>
        </div>;
      case 3:
        return <>
          <div className="bg-white shadow rounded-lg p-6 mt-3 grid grid-cols-3">
          {Object.entries(getValues()).map(([key, value]) => {
            if (key !== "fields" && value !== "" && value.length > 0) {
              return <div className='shadow rounded-lg p-3 m-1'>
                <span>{toTitleCase(key)} : </span>
                <span>{value}</span>
              </div>
            } else if(value.length > 0) {
              return <div className='shadow rounded-lg p-3 m-1'>
                <div>Fields</div>
                {value.map((field) => {
                  return <div className='grid grid-cols-3'>
                    <div><span>Name : </span><span>{field.name}</span></div>
                    <div><span>Type : </span><span>{field.type}</span></div>
                    <div><span>Required : </span><span>{field.required + ''}</span></div>
                  </div>
                })}
              </div>
            }
          })}
          </div>
          <div className='text-center mt-3'>
            {downloadUrl && (
              <a
                href={downloadUrl}
                download={`${watchedFields.artifactId || 'spring-boot-project'}.zip`}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Download className="h-4 w-5 mr-2" />
                Download Project ZIP
              </a>
            )}
            <Button
              variant="contained"
              type={"button"}
              onClick={handleSubmit(onSubmit)}
              sx={{ mt: 0, ml: 1, height: 50, marginBottom: 1 }}
              size="large"
              disabled={generating}>
              Generate Project with template engine
            </Button>

            <Button
              variant="contained"
              type={"button"}
              onClick={handleSubmit(onSubmitWithAi)}
              sx={{ mt: 0, ml: 1, height: 50, marginBottom: 1 }}
              size="large"
              disabled={generating}>
              Generate Project with AI
            </Button>
          </div>
        </>
      default:
        throw new Error('Unknown step');
    }
  }

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/generator/options');
      setOptions(response.data);
    } catch (error) {
      console.error('Error fetching options:', error);
      setError('Failed to load available options');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setGenerating(true);
      setError(null);
      setSuccess(false);
      setDownloadUrl(null);
      const response = await axios.post('http://localhost:8080/api/generator/generate', data, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setSuccess(true);
    } catch (error) {
      console.error('Error generating project:', error);
      setError('Failed to generate project. Please check your configuration.');
    } finally {
      setGenerating(false);
    }
  };

  const onSubmitWithAi = async (data) => {
    try {
      setGenerating(true);
      setError(null);
      setSuccess(false);
      setDownloadUrl(null);
      const response = await axios.post('http://localhost:5000/generate', data, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
      setSuccess(true);
    } catch (error) {
      console.error('Error generating project:', error);
      setError('Failed to generate project. Please check your configuration.');
    } finally {
      setGenerating(false);
    }
  }

  const addField = () => {
    const currentFields = watchedFields.fields || [];
    setValue('fields', [...currentFields, { name: '', type: 'String', required: true }]);
  };

  const removeField = (index) => {
    const currentFields = watchedFields.fields || [];
    setValue('fields', currentFields.filter((_, i) => i !== index));
  };

  const updateField = (index, field, value) => {
    const currentFields = watchedFields.fields || [];
    const updatedFields = [...currentFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    setValue('fields', updatedFields);
  };

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

  const fieldTypes = options.fieldTypes || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading available options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dynamic Spring Boot Generator
          </h1>
          <p className="text-xl text-gray-600">
            Create Spring Boot projects with ease - Configure all features in one place
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-800">Project generated successfully!</p>
              </div>
            </div>
          </div>
        )}

        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <LinearProgressWithLabel value={activeStep == 0 ? 20 : activeStep == 1 ? 40 : activeStep == 2 ? 60 : activeStep == 3 ? 80 : 100} />

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
            <form className="space-y-8">
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

                {activeStep === steps.length - 1 ?
                  "" :
                  <Button
                    variant="contained"
                    type={"button"}
                    disabled={generating}
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}>
                    Next
                  </Button>
                }
              </Box>
            </form>
          </React.Fragment>
        )}
      </div>
    </div >
  );
}

export default SBReactGenerator; 