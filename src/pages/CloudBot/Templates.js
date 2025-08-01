// Templates.jsx
import React, { useState } from "react";
import TemplateList from "./TemplateList";
import TemplateEditor from "./TemplateEditor";

const Templates = () => {
  // Default view is the template list. If a template is being edited, store it in state.
  const [editTemplate, setEditTemplate] = useState(null);

  return (
    <div>
      {editTemplate ? (
        <TemplateEditor
          template={editTemplate}
          onBack={() => setEditTemplate(null)}
        />
      ) : (
        <TemplateList remove={true} search={""} onEditTemplate={(template) => setEditTemplate(template)} />
      )}
    </div>
  );
};

export default Templates;
