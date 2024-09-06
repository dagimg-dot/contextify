import useGlobalStore from "@/store";
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
      prompts: "++id, &name, &content, createdAt, updatedAt, isDefault",
    });
  }
}

const db = new ContextifyDB();

const seedDefaultPrompt = async () => {
  try {
    const existingDefaultPrompt = await db.prompts
      .where("isDefault")
      .equals("true")
      .first();

    if (!existingDefaultPrompt) {
      const defaultPrompt = {
        content:
          "Can you explain the meaning of the word '[insert new word]' in this sentence: '[insert sentence]'? Please summarize the explanation in one paragraph.",
        name: "Default Prompt",
        createdAt: new Date(),
        updatedAt: new Date(),
        isDefault: true,
      };
      await db.prompts.add(defaultPrompt);
      useGlobalStore.setState({ currentPrompt: defaultPrompt });
    }
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

export type { Conversation, Message, DictionaryEntry, Prompt };
export { db, seedDefaultPrompt, seedDefaultConversation };
