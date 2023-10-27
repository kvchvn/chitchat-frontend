import { Icon } from '@/ui/icon';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

type UserInfoProps = {
  closeModal: () => void;
  session: Session;
};

export function UserInfo({ session, closeModal }: UserInfoProps) {
  const handleClick = () => {
    signOut();
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeModal();
  };

  if (!session.user.email || !session.user.name) {
    return;
  }

  return (
    <div className="absolute left-[200%] top-[-75%] border border-black bg-slate-100 py-4 pl-4 pr-8">
      <button onClick={handleCloseModal} className="absolute right-1 top-1 h-6 w-6">
        <Icon id="close-md" />
      </button>
      <h5 className="font-semibold">{session.user.name}</h5>
      <p>{session.user.email}</p>
      <button onClick={handleClick} className="mt-4 font-semibold text-rose-500 hover:underline">
        Sign Out
      </button>
    </div>
  );
}
