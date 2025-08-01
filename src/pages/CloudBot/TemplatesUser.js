// TemplatesUser.jsx
import React, { useState } from "react";
import TemplateList from "./TemplateList";
import TemplateEditor from "./TemplateEditor";
import { useParams } from "react-router-dom";

const TemplatesUser = () => {

  // Default view is the template list. If a template is being edited, store it in state.
  const [editTemplate, setEditTemplate] = useState(null);
  const { search } = useParams() || "";

  return (
    <div>
      {editTemplate ? (
        <TemplateEditor
          template={editTemplate}
          onBack={() => setEditTemplate(null)}
        />
      ) : (
        <TemplateList remove={false} search={search} onEditTemplate={(template) => setEditTemplate(template)} />
      )}
    </div>
  );
};

export default TemplatesUser;
