export function EmptyActivity() {
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
          <path
            d="M40 100H70L85 70L100 130L115 80L130 110H160"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="85" cy="70" r="4" fill="oklch(0.55 0.22 25)" />
          <circle cx="100" cy="130" r="4" fill="oklch(0.55 0.22 25)" />
          <circle cx="115" cy="80" r="4" fill="oklch(0.55 0.22 25)" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2">No activity yet</h3>
      <p className="text-muted-foreground max-w-md">
        Nothing to show. Start backing projects or ship something yourself.
      </p>
    </div>
  )
}
