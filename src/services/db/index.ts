import useGlobalStore from "@/store";
import { extractAndPersist } from "@/utils/placeholderExtractor";
import Dexie, { type Table } from "dexie";
import { toast } from "sonner";

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
  placeholders?: string[];
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
  isCurrent: 0 | 1;
}

interface Settings {
  id?: number;
  enctyptedKey: ArrayBuffer;
  iv: Uint8Array;
}

class ContextifyDB extends Dexie {
  conversations!: Table<Conversation, number>;
  messages!: Table<Message, number>;
  dictionaryEntries!: Table<DictionaryEntry, string>;
  prompts!: Table<Prompt, number>;
  settings!: Table<Settings, number>;

  constructor() {
    super("ContextifyDB");
    this.version(1).stores({
      conversations: "++id, title, createdAt, updatedAt, lastMessagePreview",
      messages: "++id, conversationId, type, timestamp, content",
      dictionaryEntries: "word, lastQueried",
      prompts:
        "++id, &name, &content, createdAt, placeholders, updatedAt, isDefault, isCurrent",
      settings: "++id, enctyptedKey",
    });
  }
}

const db = new ContextifyDB();

const seedDefaultPrompt = async () => {
  try {
    const existingDefaultPrompts = await db.prompts
      .where("isDefault")
      .equals(1)
      .toArray();

    if (existingDefaultPrompts.length > 0) {
      return;
    }

    const defaultPrompt1 = {
      content:
        "Can you explain the meaning of the word '[insert_newword]' in this sentence: '[insert_sentence]'? Please summarize the explanation in one paragraph and also give me 2 simpler examples to solidify my understanding",
      name: "Default",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: true,
      isCurrent: 1 as const,
    };
    const defaultPrompt2 = {
      content: "",
      name: "Blank",
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: true,
      isCurrent: 0 as const,
    };

    const prompt1 = extractAndPersist(defaultPrompt1);
    const prompt2 = extractAndPersist(defaultPrompt2);

    await db.prompts.bulkAdd([prompt1, prompt2]);
  } catch (error) {
    if (!(error instanceof Dexie.ConstraintError)) {
      toast.error("Failed to add default prompt");
    }
  }
};

const seedDefaultConversation = async () => {
  try {
    const existingDefaultConversation = await db.conversations
      .where("title")
      .equals("New Conversation")
      .first();

    if (!existingDefaultConversation) {
      const defaultConversation = await db.conversations.add({
        title: "New Conversation",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastMessagePreview: "Welcome to Contextify!",
      });
      useGlobalStore.setState({ currentConversationId: defaultConversation });
    }
  } catch (error) {
    if (!(error instanceof Dexie.ConstraintError)) {
      toast.error("Failed to add default conversation");
    }
  }
};

export type { Conversation, Message, DictionaryEntry, Prompt, Settings };
export { db, seedDefaultPrompt, seedDefaultConversation };
