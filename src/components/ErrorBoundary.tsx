import { Component, type ReactNode } from 'react';
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <section className="page-intro" role="alert">
          <p className="eyebrow">Out of frame</p>
          <h1>Something went wrong.</h1>
          <p className="body-copy">
            Reload to try again, or return to the portfolio.
          </p>
          <button
            className="text-link"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>{' '}
          <a className="text-link" href="/portfolio">
            Back to portfolio
          </a>
        </section>
      );
    return this.props.children;
  }
}
