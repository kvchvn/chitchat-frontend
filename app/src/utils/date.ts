import { Message } from '@prisma/client';
import { MONTHS } from '~/constants/chats';

export const getTime = (date: Message['createdAt'] | string) => {
  const dateObj = new Date(date);
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const getDateAsKey = (messageCreatedAt: Date | string) => {
  const dateObj = new Date(messageCreatedAt);
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();
  const year = dateObj.getFullYear();

  return `${month}/${date}/${year}`;
};

export const getDateWithMonthName = (date: Date | string) => {
  const dateObj = new Date(date);
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  const monthName = MONTHS[month];

  return `${monthName} ${day}`;
};
