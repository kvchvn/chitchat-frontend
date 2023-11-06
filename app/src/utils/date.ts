import { Message } from '@prisma/client';

export const getTime = (date: Message['createdAt'] | string) => {
  const dateObject = new Date(date);
  return `${dateObject.getHours()}:${dateObject.getMinutes()}`;
};
