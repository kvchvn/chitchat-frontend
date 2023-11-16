import { Icon } from '@/ui/icon';

export function IncomingRequestControls() {
  return (
    <>
      <button className="relative h-full w-10 bg-stone-300 p-1 hover:bg-stone-400">
        <Icon id="check" />
      </button>
      <button className="relative h-full w-10 bg-stone-300 p-1 hover:bg-stone-400">
        <Icon id="close-md" />
      </button>
    </>
  );
}
