import React, { useState } from 'react';
import PromptForm from './components/PromptForm';
import SuggestionList from './components/SuggestionList';
import { fetchHooks } from './services/openaiService';

function App() {
  const [hooks, setHooks] = useState([]);

  const handleGenerateHooks = async ({ prompt, tone }) => {
    const generatedHooks = await fetchHooks(prompt, tone);
    setHooks(generatedHooks);
  };

  return (
    <div className="app">
      <h1>Hook Writer</h1>
      <PromptForm onSubmit={handleGenerateHooks} />
      <SuggestionList hooks={hooks} />
    </div>
  );
}

export default App;