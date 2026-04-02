import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Send } from "lucide-react";

type Conversation = {
  id: number;
  name: string;
  preview: string;
  unread: number;
  messages: { id: number; fromMe: boolean; text: string; time: string }[];
};

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    preview: "Could you share the latest dashboard metrics?",
    unread: 2,
    messages: [
      { id: 1, fromMe: false, text: "Hi, do you have the latest dashboard metrics?", time: "09:12" },
      { id: 2, fromMe: true, text: "Yes, I can send them in a few minutes.", time: "09:14" },
      { id: 3, fromMe: false, text: "Could you share before the leadership sync?", time: "09:15" },
    ],
  },
  {
    id: 2,
    name: "Product Team",
    preview: "Sprint planning moved to 2 PM.",
    unread: 0,
    messages: [
      { id: 1, fromMe: false, text: "Sprint planning moved to 2 PM.", time: "Yesterday" },
      { id: 2, fromMe: true, text: "Noted, thanks for the update.", time: "Yesterday" },
    ],
  },
  {
    id: 3,
    name: "DevOps Channel",
    preview: "Deployment completed successfully.",
    unread: 1,
    messages: [
      { id: 1, fromMe: false, text: "Deployment completed successfully.", time: "08:05" },
      { id: 2, fromMe: false, text: "Monitoring looks healthy.", time: "08:07" },
    ],
  },
];

const Messages = () => {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState(conversations[0].id);
  const filteredConversations = conversations.filter((item) =>
    [item.name, item.preview].join(" ").toLowerCase().includes(search.trim().toLowerCase())
  );
  const activeConversation =
    filteredConversations.find((item) => item.id === activeId) ?? filteredConversations[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
        <p className="text-muted-foreground">
          Communicate with your team and customers in one place.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Your recent chats</CardDescription>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[420px] pr-3">
              <div className="space-y-2">
                {filteredConversations.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      item.id === activeId ? "border-primary bg-accent/40" : "hover:bg-accent/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium">{item.name}</p>
                      {item.unread > 0 ? <Badge>{item.unread}</Badge> : null}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{item.preview}</p>
                  </button>
                ))}
                {filteredConversations.length === 0 ? (
                  <p className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
                    No conversations found.
                  </p>
                ) : null}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {activeConversation ? (
                <>
                  <Avatar>
                    <AvatarFallback>
                      {activeConversation.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {activeConversation.name}
                </>
              ) : (
                "No active conversation"
              )}
            </CardTitle>
            <CardDescription>Conversation details and recent messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[360px] rounded-md border p-3">
              {activeConversation ? (
                <div className="space-y-3">
                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.fromMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                          message.fromMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`mt-1 text-xs ${
                            message.fromMe ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">Select a conversation to view messages.</p>
              )}
            </ScrollArea>

            <div className="flex items-center gap-2">
              <Input placeholder="Write a message..." disabled={!activeConversation} />
              <Button type="button" disabled={!activeConversation}>
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
