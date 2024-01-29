import { Icon } from '~/components/ui/icon';
import {
  useMessageEditModeActionsSelector,
  useMessageEditModeSelector,
} from '~/store/selectors/message-managing-selectors';

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
    <div className="flex items-center gap-2 bg-primary-bg-lighter px-1 dark:bg-primary-bg-darker">
      <span className="block h-8 w-8 border-r border-primary-bg-light pr-2">
        <Icon id="pencil-square" />
      </span>
      <p className="max-w-[70%] truncate font-light">{messageContent}</p>
      <button onClick={handleClose} className="relative ml-auto h-6 w-6 hover:bg-primary-bg-dark">
        <Icon id="close" />
      </button>
    </div>
  );
}
