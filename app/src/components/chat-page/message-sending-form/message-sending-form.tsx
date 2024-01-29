import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '~/components/ui/icon';
import { MESSAGE_MAX_LENGTH } from '~/constants/chat';
import {
  useMessageEditModeActionsSelector,
  useMessageEditModeSelector,
} from '~/store/selectors/message-managing-selectors';
import { useSocketSelector } from '~/store/selectors/socket-selectors';
import { Nullable } from '~/types/global';
import { NormalizedAllowedMessageLength } from './normalized-allowed-message-length';

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

  const handleClick = () => {
    textareaRef.current?.focus();
  };

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
    textareaRef.current?.focus();

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
    <section onClick={handleClick} className="flex cursor-text pt-2">
      <textarea
        ref={textareaRef}
        name="message"
        placeholder="Write your message"
        value={messageContent}
        maxLength={MESSAGE_MAX_LENGTH}
        onChange={handleChange}
        className="mr-2 block max-h-32 w-full resize-none bg-transparent outline-none placeholder:font-thin"
      />
      <NormalizedAllowedMessageLength
        allowedLength={MESSAGE_MAX_LENGTH - messageContent.length}
        digits={String(MESSAGE_MAX_LENGTH).length}
      />
      <button
        onClick={handleSendMessage}
        disabled={!messageContent || (isOnEditMode && messageContent === editedMessageContent)}
        className="h-12 w-12 shrink-0 cursor-pointer rounded-full hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:!bg-transparent dark:hover:bg-teal-600"
      >
        <Icon id={isOnEditMode ? 'save' : 'send'} />
      </button>
    </section>
  );
}
