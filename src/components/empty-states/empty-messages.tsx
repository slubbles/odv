export function EmptyMessages() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-8">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-50"
        >
          <rect x="40" y="60" width="120" height="80" rx="8" stroke="oklch(0.55 0.22 25)" strokeWidth="2" />
          <path d="M40 80H160" stroke="oklch(0.55 0.22 25)" strokeWidth="2" />
          <circle cx="70" cy="105" r="4" fill="oklch(0.55 0.22 25)" />
          <circle cx="100" cy="105" r="4" fill="oklch(0.55 0.22 25)" />
          <circle cx="130" cy="105" r="4" fill="oklch(0.55 0.22 25)" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2">Inbox zero</h3>
      <p className="text-muted-foreground max-w-md">No messages from backers. Yet. Keep building, they'll come.</p>
    </div>
  )
}
