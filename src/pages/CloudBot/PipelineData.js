// export const pipelineOptions = {
//   objectives: [
//     {
//       id: "obj1",
//       value: "dataPreprocessing",
//       label: "Extraction and Analysis",
//       platforms: [
//         {
//           id: "plat1",
//           value: "awsBedrock",
//           label: "Bedrock (AWS)",
//           models: [
//             { id: "model1", value: "awsModel1", label: "Cohere Command R+" },
//           ],
//         },
//         {
//           id: "plat2",
//           value: "azureOpenAI",
//           label: "Open AI (Azure)",
//           models: [
//             { id: "model3", value: "azureModel1", label: "GPT-4" },
//           ],
//         },
//         {
//           id: "plat4",
//           value: "gcp",
//           label: "Vertex AI (GCP)",
//           models: [
//             { id: "model3", value: "azureModel1", label: "Gemini Pro" },
//             { id: "model4", value: "azureModel2", label: "Codey" },
//           ],
//         },
//       ],
//     },
//     {
//       id: "obj2",
//       value: "fineTuning",
//       label: "Fine Tuning",
//       platforms: [
//         {
//           id: "plat3",
//           value: "azureOpenAI",
//           label: "Azure",
//           models: [
//             { id: "model5", value: "azureModel3", label: "Azure-Model-3" },
//             { id: "model6", value: "azureModel4", label: "Azure-Model-4" },
//           ],
//         },
//         {
//           id: "plat4",
//           value: "vertex",
//           label: "GCP",
//           models: [
//             { id: "model7", value: "vertexModel1", label: "GCP-Model-1" },
//             { id: "model8", value: "vertexModel2", label: "GCP-Model-2" },
//           ],
//         },
//       ],
//     },
//     {
//       id: "obj3",
//       value: "inference",
//       label: "Inference",
//       platforms: [
//         {
//           id: "plat5",
//           value: "awsBedrock",
//           label: "AWS",
//           models: [
//             { id: "model9", value: "awsModel3", label: "AWS-Model-3" },
//             { id: "model10", value: "awsModel4", label: "AWS-Model-4" },
//           ],
//         },
//         {
//           id: "plat6",
//           value: "vertex",
//           label: "GCP",
//           models: [
//             { id: "model11", value: "vertexModel3", label: "GCP-Model-3" },
//             { id: "model12", value: "vertexModel4", label: "GCP-Model-4" },
//           ],
//         },
//       ],
//     },
//   ],
// };

// transformPipelineOptions.js

// (Optional) Default master structure if nothing is in local storage
const defaultMasterData = {
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
  objectives: [
    // Example objective for demonstration (you’d expect your UI to have filled these out)
    // { id: "obj1", label: "Extraction and Analysis", platformIds: ["plat1", "plat2"], modelIds: ["model1", "model3"] },
  ],
};

// Helper: convert a string to camelCase.
// This simple function removes non-alphanumeric characters and then concatenates words.
const toCamelCase = (str) => {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

// Helper: Generate objective "value". You might want a custom mapping instead.
const getObjectiveValue = (label) => {
  // If you have special mappings (like "Extraction and Analysis" yielding "dataPreprocessing"),
  // you can introduce them here. For example:
  const mapping = {
    "Extraction and Analysis": "dataPreprocessing",
    "Fine Tuning": "fineTuning",
    Inference: "inference",
  };
  return mapping[label] || toCamelCase(label);
};

// Helper: Generate a platform "value" based on its label.
const getPlatformValue = (label) => {
  const lower = label.toLowerCase();
  if (lower.includes("aws")) return "awsBedrock";
  if (lower.includes("azure")) return "azureOpenAI";
  if (lower.includes("gcp") || lower.includes("vertex")) return "vertex";
  return toCamelCase(label);
};

// Helper: Generate a model "value" based on its label and platform.
// For simplicity, prepend the platform value.
const getModelValue = (label, platformLabel) => {
  return getPlatformValue(platformLabel) + toCamelCase(label);
};

// Main transformation function
function transformPipelineOptions(masterData) {
  // Ensure we have arrays:
  const platforms = masterData.platforms ?? [];
  const models = masterData.models ?? [];
  const objectives = masterData.objectives ?? [];

  const transformedObjectives = objectives.map((obj) => {
    return {
      id: obj.id,
      value: obj.value || getObjectiveValue(obj.label),
      label: obj.label,
      // For each objective, select the platform objects whose ids are in obj.platformIds.
      // Then, within each platform, attach the models that match both:
      // (a) the objective's modelIds and (b) the platform id.
      platforms: platforms.filter((p) => (obj.platformIds ?? []).includes(p.id)).map((p) => {
        return {
          id: p.id,
          // Generate value for platform.
          value: getPlatformValue(p.label),
          label: p.label,
          models: models
            .filter((m) => (obj.modelIds ?? []).includes(m.id) && m.platformId === p.id)
            .map((m) => ({
              id: m.id,
              // Generate model value using model label and its platform's label.
              value: getModelValue(m.label, p.label),
              label: m.label,
            })),
        };
      }),
    };
  });

  return {
    objectives: transformedObjectives,
  };
}

// Function to read master data from local storage and generate the final response.
export function getTransformedPipelineOptions() {
  const stored = localStorage.getItem("pipelineOptions");
  const masterData = stored ? JSON.parse(stored) : defaultMasterData;
  return transformPipelineOptions(masterData);
}

// Example usage: if you console.log(getTransformedPipelineOptions());
// You could also export it as a constant if you want:
// export const pipelineOptionsFinal = getTransformedPipelineOptions();

export const pipelineOptions=getTransformedPipelineOptions();
// Function to extract unique providers and create the mapping
const transformPipelineToBaseModelMapping = (pipelineOptions) => {
  const baseModelMapping = {};
  const baseModelProviders = new Set();

  pipelineOptions.objectives.forEach((objective) => {
    objective.platforms.forEach((platform) => {
      const providerName = platform.label;

      baseModelProviders.add(providerName);

      if (!baseModelMapping[providerName]) {
        baseModelMapping[providerName] = [];
      }

      platform.models.forEach((model) => {
        baseModelMapping[providerName].push(model.label);
      });
    });
  });

  return {
    baseModelProviders: Array.from(baseModelProviders),
    baseModelMapping,
  };
};

// Generate the baseModelProviders and baseModelMapping variables
const { baseModelProviders, baseModelMapping } = transformPipelineToBaseModelMapping(pipelineOptions);

export { baseModelProviders, baseModelMapping };

  /*
    Mapping for allowed file selection types based on objective.
    For example:
      - dataPreprocessing supports both "file" and "folder"
      - fineTuning supports only "folder"
      - inference supports only "file"
  */
  // export const fileSelectionMapping = {
  //   dataPreprocessing: ["file", "folder"],
  //   fineTuning: ["folder"],
  //   inference: ["file"],
  // };

  // This snippet retrieves the master data and then transforms the objectives into
// the desired mapping format.
const LOCAL_STORAGE_KEY = "pipelineOptions";
export const fileSelectionMapping = (() => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  const masterData = stored ? JSON.parse(stored) : defaultMasterData;
  
 
  // Reduce the objectives array into the mapping.
  const postreduce= (masterData.objectives ?? []).reduce((acc, objective) => {
    // You can decide what to use as key.
    // For example, if objective.value exists, use that; otherwise, use objective.id.
    const key = objective.label || objective.value || objective.id ;
    acc[key] = objective.inputMethods ? [...objective.inputMethods] : [];
    return acc;
  }, {});

  console.log(postreduce)
  return postreduce;
})();
  
  /* 
    For the review action we simulate “legacy” and “modern” code folders.
    In a real project these could be loaded as static assets or using require.context.
  */
    export const legacyFiles = {
    "App.js": "/* Legacy App.js content */\nconsole.log('Legacy code');",
    "index.js": "/* Legacy index.js content */\nReactDOM.render(...);",
    "utils.js": "/* Legacy utils.js code */\nfunction helper() { return 42; }",
  };
  
  export const modernFiles = {
    "App.js": "/* Modern App.js content */\nconsole.log('Modern code with new features');",
    "index.js": "/* Modern index.js content */\nReactDOM.render(<App />, document.getElementById('root'));",
    // Note: if a file is missing (like "utils.js"), we will show migration progress.
  };
  