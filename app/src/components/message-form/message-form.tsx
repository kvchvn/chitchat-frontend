import { useSocketSelector } from '@/store';
import { useCallback, useEffect, useState } from 'react';

type MessageFormProps = {
  chatId: string;
  userId: string;
};

export function MessageForm({ chatId, userId }: MessageFormProps) {
  const [messageContent, setMessageContent] = useState('');

  const socket = useSocketSelector();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageContent(e.target.value);
  };

  const handleSendMessage = useCallback(async () => {
    if (!socket) return;

    const trimmedMessage = messageContent.trim();

    if (trimmedMessage) {
      socket.emit('message:create', {
        chatId,
        senderId: userId,
        content: trimmedMessage,
      });
    }

    setMessageContent('');
  }, [chatId, messageContent, socket, userId]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.code === 'Enter' || e.key === 'Enter') && messageContent && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    if (messageContent) {
      document.addEventListener('keypress', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [handleSendMessage, messageContent]);

  return (
    <form className="flex h-[7%] border-t border-black p-1">
      <textarea
        name="message"
        placeholder="Write your message here..."
        autoFocus
        value={messageContent}
        maxLength={150}
        onChange={handleChange}
        className="h-full w-full resize-none outline-none"
      />
      <button
        onClick={handleSendMessage}
        disabled={!messageContent}
        className="text-cyan h-10 self-end rounded-full border-2 border-cyan-900 bg-cyan-300 px-3 py-1 hover:bg-cyan-500 disabled:grayscale"
      >
        Send
      </button>
    </form>
  );
}
