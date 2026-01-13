import { Component, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    // Keep a readable error in production builds.
    console.error('Uncaught UI error:', error)
    if (info?.componentStack) console.error(info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-lg font-semibold">Si è verificato un errore</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Ricarica la pagina. Se succede ancora, mandami lo screenshot di questa schermata e/o la console.
          </div>
          <pre className="mt-4 overflow-auto rounded-xl border border-border bg-background/30 p-4 text-xs text-muted-foreground">
            {this.state.error.name}: {this.state.error.message}
          </pre>
        </div>
      </div>
    )
  }
}
