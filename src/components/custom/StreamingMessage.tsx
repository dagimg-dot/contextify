import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const StreamingMessage = React.memo(({ content }: { content: string }) => (
  <div className="flex justify-start mb-4">
    <Card className="max-w-[80%]">
      <CardContent className="p-3">
        <p className="text-left">{content}</p>
      </CardContent>
    </Card>
  </div>
));

export default StreamingMessage;
