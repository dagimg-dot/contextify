import type { Prompt } from "@/services/db";

const extractPlaceholders = (prompt: string) => {
  // Match all substrings enclosed in square brackets (e.g., [insert_word])
  const regex = /\[(.*?)\]/g;
  const matches = [];
  let match: RegExpExecArray | null;

  // Iterate over all matches
  while ((match = regex.exec(prompt)) !== null) {
    matches.push(match[1]); // Extract only the placeholder name inside the brackets
  }

  return matches;
};

const extractAndPersist = (prompt: Prompt) => {
  const placeHolders = extractPlaceholders(prompt.content);
  prompt.placeholders = placeHolders;
  return prompt;
};

export { extractPlaceholders, extractAndPersist };
