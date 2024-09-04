export type MessageType = {
  type: "user" | "system" | "ai";
  content: string;
};