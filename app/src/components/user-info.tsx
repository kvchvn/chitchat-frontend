import { Session } from 'next-auth';

type UserInfoProps = {
  session: Session;
};

export default function UserInfo({ session }: UserInfoProps) {
  if (!session.user?.email || !session.user?.name) {
    return;
  }

  return (
    <div className="plate-shadow absolute bottom-0 left-[90%] rounded-lg bg-white px-8 py-3">
      <h5 className="font-semibold">{session.user.name}</h5>
      <p>{session.user.email}</p>
    </div>
  );
}
