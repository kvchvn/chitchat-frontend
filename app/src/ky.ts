import ky from 'ky';

export const customKy = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_SERVER_URL,
  hooks: {
    beforeError: [(error) => error.response.json()],
  },
});
