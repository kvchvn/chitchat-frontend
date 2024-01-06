import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '~/components/ui/icon';
import { MESSAGE_MAX_LENGTH } from '~/constants/chat';
import {
  useMessageEditModeActionsSelector,
  useMessageEditModeSelector,
} from '~/store/selectors/message-managing-selectors';
import { useSocketSelector } from '~/store/selectors/socket-selectors';
import { Nullable } from '~/types/global';

type MessageSendingFormProps = {
  chatId: string;
  userId: string;
};

export function MessageSendingForm({ chatId, userId }: MessageSendingFormProps) {
  const [messageContent, setMessageContent] = useState('');

  const socket = useSocketSelector();
  const {
    isOn: isOnEditMode,
    messageId,
    messageContent: editedMessageContent,
  } = useMessageEditModeSelector();
  const { turnOffEditMode } = useMessageEditModeActionsSelector();

  const textareaRef = useRef<Nullable<HTMLTextAreaElement>>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;

    setMessageContent((prevValue) =>
      (!(MESSAGE_MAX_LENGTH - prevValue.length) && prevValue.length > target.value.length) ||
      MESSAGE_MAX_LENGTH - prevValue.length
        ? target.value
        : prevValue
    );
  };

  const handleSendMessage = useCallback(async () => {
    if (!socket) return;

    const trimmedMessage = messageContent.trim();
    console.log('click send message');
    if (trimmedMessage) {
      if (isOnEditMode && messageId) {
        socket.emit('message:edit', { chatId, messageId, updatedContent: trimmedMessage });
        turnOffEditMode();
      } else {
        socket.emit('message:create', { chatId, senderId: userId, content: trimmedMessage });
      }
    }

    setMessageContent('');
  }, [chatId, messageContent, socket, userId, isOnEditMode, messageId, turnOffEditMode]);

  useEffect(() => {
    if (messageContent) {
      const onKeyPress = (e: KeyboardEvent) => {
        if ((e.code === 'Enter' || e.key === 'Enter') && messageContent && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
        }
      };

      document.addEventListener('keypress', onKeyPress);

      return () => {
        document.removeEventListener('keypress', onKeyPress);
      };
    }
  }, [handleSendMessage, messageContent]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }

    if (isOnEditMode && editedMessageContent) {
      setMessageContent(editedMessageContent);
    } else {
      setMessageContent('');
    }
  }, [isOnEditMode, editedMessageContent]);

  useEffect(() => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;

    if (textarea.scrollHeight > textarea.clientHeight) {
      textarea.style.height = `${textarea.scrollHeight}px`;
    } else {
      textarea.style.height = '0px';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [messageContent]);

  return (
    <section className="flex gap-3 border-t border-black px-2 pt-1">
      <textarea
        ref={textareaRef}
        name="message"
        placeholder="Write your message here..."
        value={messageContent}
        maxLength={150}
        onChange={handleChange}
        className="h-6 max-h-32 w-full resize-none outline-none placeholder:font-thin"
      />
      <p>{MESSAGE_MAX_LENGTH - messageContent.length}</p>
      <button
        onClick={handleSendMessage}
        disabled={!messageContent || (isOnEditMode && messageContent == editedMessageContent)}
        className="h-10 w-10 cursor-pointer self-end rounded-full border-2 border-black p-1 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-gray-200"
      >
        <Icon id={isOnEditMode ? 'save' : 'paper-plane'} />
      </button>
    </section>
  );
}
