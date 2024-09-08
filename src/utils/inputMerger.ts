import { db } from "@/services/db";

const extractWord = (input: string) => {
  const regex = /\*(.*?)\*/g;
  const matches = input.match(regex);

  if (matches && matches.length > 0) {
    return matches[0].replace("*", "").replace("*", "").trim();
  }

  return "";
};

const cleanInput = (input: string, word: string) => {
  return input.replace(`*${word}*`, word).trim();
};

export const mergeInput = async (input: string, choosenWord?: string) => {
  const currentPrompt = await db.prompts.where("isCurrent").equals(1).first();

  if (!currentPrompt) {
    return input;
  }

  let word = extractWord(input);

  if (choosenWord !== "" && choosenWord !== undefined) {
    word = choosenWord;
  }

  const cleanedInput = cleanInput(input, word);23
  const finalPrompt = currentPrompt.content
    .replace("[insert new word]", word)
    .replace("[insert sentence]", cleanedInput);

  return finalPrompt;
};
