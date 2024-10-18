import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { db } from "@/services/db";
import { encrypt } from "@/utils/cryptoHandler";
import { toast } from "sonner";

const GeneralSettings = () => {
  const [apiKey, setApiKey] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [keyId, setKeyId] = useState<number | null>(null);

  const getApiKey = async () => {
    const settings = await db.settings.toArray();
    if (settings.length > 0) {
      setApiKey("got ya buddy🤣");
      setIsKeySaved(true);
      setKeyId(settings[0].id!);
    }
  };

  useEffect(() => {
    getApiKey();
  }, []);

  const saveApiKey = async () => {
    const { encryptedData: enctyptedKey, iv } = await encrypt(apiKey);

    try {
      const existingKey = await db.settings.toArray();
      if (existingKey.length > 0) {
        await db.settings.update(existingKey[0].id!, {
          enctyptedKey,
          iv,
        });
      } else {
        await db.settings.add({
          enctyptedKey,
          iv,
        });
      }

      setIsKeySaved(true);
      toast.success(
        "API key saved successfully, please refresh the page to apply changes"
      );
      window.location.reload();
    } catch (error) {
      toast.error("Failed to save API key");
    }
  };
  
  const resetApiKey = async () => {
    try {
      await db.settings.delete(keyId!);
      setApiKey("");
      setIsKeySaved(false);
      
      toast.success("API key reset successfully, please refresh the page to apply changes");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to reset API key");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gemini API Key</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-center">
        <Input
          type="password"
          placeholder="Enter your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button className="w-full" onClick={saveApiKey} disabled={isKeySaved || apiKey == ""}>
          Save API Key
        </Button>
        {isKeySaved && (
          <Button variant="outline" onClick={resetApiKey}>
            Reset API Key
          </Button>
        )}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          className="text-sm text-blue-600"
        >
          Don't have an API key? Get one here!
        </a>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
