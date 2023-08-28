import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

export default function AboutPage() {
  return (
    <>
      <h2>About Page</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat, perferendis! Dignissimos
        voluptas optio sint deserunt dolores. Porro similique sapiente dolore odit, expedita laborum
        in aspernatur reprehenderit molestias minus, sequi temporibus.
      </p>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  return {
    props: {
      session,
    },
  };
};
