import { useState, useEffect } from "react";
import { messages as messagesStorage, auth } from "@/lib/storage";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

interface Conversation {
  user_id: string;
  last_message: string;
  last_message_time: string;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const userId = searchParams.get("user");
    if (userId) {
      setSelectedUserId(userId);
    }
  }, [searchParams]);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
      setCurrentUserId(currentUser.id);
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (selectedUserId && currentUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId, currentUserId]);

  const fetchConversations = () => {
    if (!currentUserId) return;

    const allMessages = messagesStorage.getAll();
    const userMessages = allMessages.filter(
      msg => msg.sender_id === currentUserId || msg.receiver_id === currentUserId
    );

    const conversationMap = new Map<string, Conversation>();
    userMessages.forEach((msg) => {
      const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user_id: otherUserId,
          last_message: msg.content,
          last_message_time: msg.created_at,
        });
      }
    });

    setConversations(Array.from(conversationMap.values()));
  };

  const fetchMessages = (userId: string) => {
    if (!currentUserId) return;

    const allMessages = messagesStorage.getAll();
    const conversation = allMessages.filter(
      msg =>
        (msg.sender_id === currentUserId && msg.receiver_id === userId) ||
        (msg.sender_id === userId && msg.receiver_id === currentUserId)
    );

    setMessages(conversation);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedUserId || !currentUserId) return;

    try {
      messagesStorage.create({
        sender_id: currentUserId,
        receiver_id: selectedUserId,
        content: messageText,
      });

      setMessageText("");
      fetchMessages(selectedUserId);
      fetchConversations();
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <MessageCircle className="h-8 w-8" />
            Messages
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {conversations.map((conv) => (
                  <Button
                    key={conv.user_id}
                    variant={selectedUserId === conv.user_id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedUserId(conv.user_id)}
                  >
                    <div className="text-left truncate">
                      <div className="font-medium">User {conv.user_id.slice(0, 8)}</div>
                      <div className="text-xs text-muted-foreground truncate">{conv.last_message}</div>
                    </div>
                  </Button>
                ))}
                {conversations.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No conversations yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2 flex flex-col">
              <CardHeader>
                <CardTitle>
                  {selectedUserId ? `Chat with User ${selectedUserId.slice(0, 8)}` : "Select a conversation"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {selectedUserId ? (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.sender_id === currentUserId
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    Select a conversation to start messaging
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
