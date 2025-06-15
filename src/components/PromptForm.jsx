import React, { useState } from 'react';
import { fetchHooks } from '../services/openaiService';

function PromptForm() {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('funny');
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const generatedHooks = await fetchHooks(prompt, tone);
      setHooks(generatedHooks);
    } catch (error) {
      console.error('Error generating hooks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="prompt-form">
        <div>
          <label htmlFor="prompt">Enter Topic:</label>
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. how to lose weight"
            required
          />
        </div>

        <div>
          <label htmlFor="tone">Choose Tone:</label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="funny">Funny</option>
            <option value="mysterious">Mysterious</option>
            <option value="surprising">Surprising</option>
            <option value="motivational">Motivational</option>
          </select>
        </div>

        <button type="submit">{loading ? 'Generating...' : 'Generate Hooks'}</button>
      </form>

      {/* Render the generated hooks */}
      {hooks.length > 0 && (
        <div className="suggestions">
          <h3>Generated Hooks:</h3>
          <ul>
            {hooks.map((hook, index) => (
              <li key={index}>{hook}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default PromptForm;