import { ErrorResponse } from '~/types/api';
import { Nullable } from '~/types/global';

type ServerErrorFallbackProps = React.PropsWithChildren & {
  error: Nullable<ErrorResponse>;
};

export function ServerErrorFallback({ error, children }: ServerErrorFallbackProps) {
  if (!error) {
    return children;
  }

  return (
    <div>
      <p>Error occurred on Chat Page</p>
      <p>
        {error.status} {error.message}
      </p>
    </div>
  );
}
