import { db } from "@/services/db";

// Extract words enclosed in asterisks (*)
const extractWord = (input: string) => {
  const regex = /\*(.*?)\*/g;
  const matches = input.match(regex);

  if (matches && matches.length > 0) {
    return matches[0].replace(/\*/g, "").trim(); // Replace all asterisks
  }

  return "";
};

const cleanInput = (input: string, word: string) => {
  return input.replace(`*${word}*`, word).trim();
};

// Replace placeholders dynamically using a map of values
const replacePlaceholders = (
  template: string,
  values: Record<string, string>
) => {
  return template.replace(/\[(.*?)\]/g, (_, placeholder) => {
    return values[placeholder] || `[${placeholder}]`; // Return the value or the placeholder itself if not found
  });
};

export const mergeInput = async (input: string, choosenWord?: string) => {
  const currentPrompt = await db.prompts.where("isCurrent").equals(1).first();

  // If no prompt is found or a blank prompt is chosen, return the original input
  if (!currentPrompt || currentPrompt.name === "Blank") {
    return input;
  }

  let word = extractWord(input);
  if (choosenWord) {
    word = choosenWord;
  }

  const cleanedInput = cleanInput(input, word);

  const values = {
    insert_newword: word,
    insert_sentence: cleanedInput || input,
  };

  // Replace all placeholders dynamically in the prompt content
  const finalPrompt = replacePlaceholders(currentPrompt.content, values);

  return finalPrompt;
};
