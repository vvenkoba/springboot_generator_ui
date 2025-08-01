// ExpandableText.js
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const ExpandableText = ({ text, maxLength = 50 }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!text) return null;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // If text is short enough, simply render it.
  if (text.length <= maxLength) {
    return <Typography variant="body2">{text}</Typography>;
  }

  return (
    <Typography variant="body2">
      {expanded ? text : text.substring(0, maxLength)}
      <Link
        component="button"
        variant="body2"
        onClick={toggleExpanded}
        sx={{ ml: 0.5 }}
      >
        {expanded ? '...less' : '...more'}
      </Link>
    </Typography>
  );
};

export default ExpandableText;
