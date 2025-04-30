import { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props cho ErrorBoundary
 */
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

/**
 * State cho ErrorBoundary
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Component ErrorBoundary để bắt và xử lý lỗi trong React
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Có thể log lỗi vào service
    console.error('Lỗi được bắt bởi ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
