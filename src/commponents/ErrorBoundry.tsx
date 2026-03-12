import React from 'react';
import type { ReactNode } from 'react';
import './errorBoundary.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }
  handleReload = () => {
    window.location.reload();
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div>
            <h1>Oops! Something went wrong.</h1>
            <p>Please try refreshing the page.</p>
            <button onClick={this.handleReload}>
              <FontAwesomeIcon icon={faRotateRight} /> Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}