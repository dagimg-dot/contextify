import Dexie, { type Table } from "dexie";

interface Conversation {
  id?: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessagePreview: string;
}

interface Message {
  id?: number;
  conversationId: number;
  content: string;
  type: "user" | "ai" | "system";
  timestamp: Date;
  metadata?: object;
}

interface DictionaryEntry {
  word: string;
  definition: string;
  context: string;
  lastQueried: Date;
}

interface Prompt {
  id?: number;
  content: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
}

class ContextifyDB extends Dexie {
  conversations!: Table<Conversation, number>;
  messages!: Table<Message, number>;
  dictionaryEntries!: Table<DictionaryEntry, string>;
  prompts!: Table<Prompt, number>;

  constructor() {
    super("ContextifyDB");
    this.version(1).stores({
      conversations: "++id, title, createdAt, updatedAt, lastMessagePreview",
      messages: "++id, conversationId, type, timestamp, content",
      dictionaryEntries: "word, lastQueried",
      prompts: "++id, name, createdAt, updatedAt, isDefault",
    });
  }
}

const db = new ContextifyDB();

export type { Conversation, Message, DictionaryEntry, Prompt };
export { db };
