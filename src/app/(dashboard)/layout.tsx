import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--bg-void)' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md"
        style={{ background: 'var(--accent-cyan)', color: '#000' }}
      >
        Skip to main content
      </a>
      <div className="noise-overlay" />
      <div className="scanlines" />
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar />
        <main
          id="main-content"
          className="flex-1 overflow-hidden relative"
          style={{
            background: 'var(--bg-secondary)',
            borderTopLeftRadius: 'var(--radius-xl)',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
