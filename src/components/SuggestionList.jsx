import React from 'react';

function SuggestionList({ hooks }) {
  if (!hooks.length) return null;

  return (
    <div className="suggestion-list">
      <h2>Generated Hooks:</h2>
      <ul>
        {hooks.map((hook, index) => (
          <li key={index}>{hook}</li>
        ))}
      </ul>
    </div>
  );
}

export default SuggestionList;