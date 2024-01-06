import { Icon } from '~/components/ui/icon';

export function DisabledChatMessage() {
  return (
    <div className="flex items-center gap-2 bg-red-100 p-1">
      <span className="h-6 w-6">
        <Icon id="warning" />
      </span>
      <p className="text-sm text-red-900">You should add to friends the user to send messages.</p>
    </div>
  );
}
