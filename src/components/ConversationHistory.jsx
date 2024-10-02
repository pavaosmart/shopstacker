import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const ConversationHistory = ({ conversations, onSelectConversation }) => {
  return (
    <div className="w-64 bg-gray-100 p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">Histórico de Conversas</h2>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        {conversations.map((conversation, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start mb-2 text-left"
            onClick={() => onSelectConversation(conversation)}
          >
            {conversation.title || `Conversa ${index + 1}`}
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
};

export default ConversationHistory;