'use client';

import {
  useMessageEditModeActionsSelector,
  useMessageEditModeSelector,
} from '~/store/selectors/message-managing-selectors';
import { Icon } from '~/ui/icon';

export function EditedMessagePreview() {
  const { isOn, messageContent } = useMessageEditModeSelector();
  const { turnOffEditMode } = useMessageEditModeActionsSelector();

  if (!isOn || !messageContent) {
    return null;
  }

  const handleClose = () => {
    turnOffEditMode();
  };

  return (
    <div className="flex items-center gap-2 bg-stone-300 px-2 py-1">
      <span className="block h-6 w-7 border-r border-black pr-2">
        <Icon id="pencil" />
      </span>
      <p className="max-w-[80%] truncate">{messageContent}</p>
      <button onClick={handleClose} className="relative ml-auto h-6 w-6 hover:bg-stone-400">
        <Icon id="close-md" />
      </button>
    </div>
  );
}
