import React from 'react';
import { ROUTES } from '~/constants/global';

type ErrorBoundaryProps = React.PropsWithChildren & {
  fallback: React.ReactNode;
};

type ErrorBoundaryState = {
  isError: boolean;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { isError: false };
  }

  static getDerivedStateFromError(err: unknown) {
    console.log({ err });

    return { isError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log({ error, errorInfo });
  }

  handleClick() {
    location.href = ROUTES.home;
  }

  render() {
    return this.state.isError ? (
      <>
        <h2>Something went wrong</h2>
        <p>
          Don&apos;t worry, we have already received bug report. We&apos;ll fix this as soon as
          possible.
        </p>
        {this.props.fallback}
        <button onClick={this.handleClick.bind(this)}>return Home</button>
      </>
    ) : (
      this.props.children
    );
  }
}
