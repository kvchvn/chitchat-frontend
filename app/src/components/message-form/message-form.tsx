import { useSocketSelector } from '@/store';
import { Nullable } from '@/types';
import { Icon } from '@/ui/icon';
import { useCallback, useEffect, useRef, useState } from 'react';

type MessageFormProps = {
  chatId: string;
  userId: string;
};

export function MessageForm({ chatId, userId }: MessageFormProps) {
  const [messageContent, setMessageContent] = useState('');

  const socket = useSocketSelector();
  const textareaRef = useRef<Nullable<HTMLTextAreaElement>>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setMessageContent(target.value);

    console.log('change', {
      scroll: target.scrollHeight,
      client: target.clientHeight,
    });

    if (target.scrollHeight > target.clientHeight) {
      target.style.height = `${target.scrollHeight}px`;
    } else {
      target.style.height = '0px';
      target.style.height = `${target.scrollHeight}px`;
    }
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
    if (textareaRef.current) {
      textareaRef.current.style.height = '';
    }
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
    <form className="flex gap-3 border-t border-black px-2 pt-1">
      <textarea
        ref={textareaRef}
        name="message"
        placeholder="Write your message here..."
        autoFocus
        value={messageContent}
        maxLength={150}
        onChange={handleChange}
        className="h-6 max-h-32 w-full resize-none outline-none placeholder:font-thin"
      />
      <button
        onClick={handleSendMessage}
        disabled={!messageContent}
        className="h-10 w-10 cursor-pointer self-end rounded-full border-2 border-black p-1 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-gray-200"
      >
        <Icon id="paper-plane" />
      </button>
    </form>
  );
}
