// src/services/openaiService.js

const OPENAI_API_KEY = 'your-api-key-here'; // Replace with actual API key securely (later)

export async function fetchHooks(prompt, tone) {

  return [
    `Realistic ${tone} hook 1 for "${prompt}"`,
    `Realistic ${tone} hook 2 for "${prompt}"`,
    `Realistic ${tone} hook 3 for "${prompt}"`,
  ];
}