import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Message = React.memo(({ message }) => (
  <div
    className={`flex ${
      message.type === "user" ? "justify-end" : "justify-start"
    } mb-4`}
  >
    <Card
      className={`max-w-[80%] ${message.type === "system" ? "bg-muted" : ""}`}
    >
      <CardContent className="p-3">
        <p className={message.type === "user" ? "text-right" : "text-left"}>
          {message.content}
        </p>
      </CardContent>
    </Card>
  </div>
));

export default Message;
