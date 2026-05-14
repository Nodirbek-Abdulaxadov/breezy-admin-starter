import * as React from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    if (this.props.onError) this.props.onError(error, info);
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info);
    }
  }

  private handleReset = (): void => {
    this.setState({ error: null });
  };

  private handleReload = (): void => {
    if (typeof window !== "undefined") window.location.reload();
  };

  render(): React.ReactNode {
    const { error } = this.state;
    if (!error) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    const isDev = import.meta.env.DEV;

    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="break-words text-sm text-muted-foreground">
              {error.message || "An unexpected error occurred."}
            </p>

            {isDev && error.stack ? (
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all rounded border bg-muted p-3 text-xs">
                {error.stack}
              </pre>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button onClick={this.handleReset}>Try again</Button>
              <Button variant="outline" onClick={this.handleReload}>
                Reload
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default ErrorBoundary;
