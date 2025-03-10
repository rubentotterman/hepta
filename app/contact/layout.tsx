export default function ContactLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="h-screen w-screen overflow-hidden">
        {children}
      </div>
    )
  }