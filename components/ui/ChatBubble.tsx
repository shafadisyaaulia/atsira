import React from "react";
import { ThumbsUp } from "lucide-react";
import { ROLE_COLOR } from "@/lib/chat-consts";

interface ChatBubbleProps {
  message: {
    id: string;
    sender_name: string;
    sender_role: string;
    content: string;
    created_at: string;
    likes: number;
    isOwn: boolean;
  };
  onLike: () => void;
  isLiked: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onLike, isLiked }) => {
  return (
    <div className={`flex w-full ${message.isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${message.isOwn ? "bg-emerald-700 text-white rounded-br-none" : "bg-white border border-stone-200 text-stone-800 rounded-bl-none"}`}>
        {!message.isOwn && (
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] font-bold text-stone-500">{message.sender_name}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded ${ROLE_COLOR[message.sender_role] || 'bg-stone-100'}`}>
              {message.sender_role}
            </span>
          </div>
        )}
        <p className="text-sm leading-relaxed">{message.content}</p>
        <div className="flex items-center justify-between mt-1 gap-2">
            <span className={`text-[9px] ${message.isOwn ? "text-emerald-100" : "text-stone-400"}`}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button
                onClick={onLike}
                className={`flex items-center gap-1 text-[10px] ${
                    isLiked ? "text-emerald-300 font-semibold" : message.isOwn ? "text-emerald-100 hover:text-white" : "text-stone-400 hover:text-emerald-500"
                }`}
                >
                <ThumbsUp className="w-3 h-3" /> {message.likes}
            </button>
        </div>
      </div>
    </div>
  );
};
