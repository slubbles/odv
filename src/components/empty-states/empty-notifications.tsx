export function EmptyNotifications() {
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
          <circle cx="100" cy="70" r="30" stroke="oklch(0.55 0.22 25)" strokeWidth="2" />
          <path
            d="M80 100C80 100 80 70 80 70C80 56 87 50 100 50C113 50 120 56 120 70C120 70 120 100 120 100"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth="2"
          />
          <path
            d="M70 100H130C130 100 135 100 135 105V115C135 120 130 120 130 120H70C70 120 65 120 65 115V105C65 100 70 100 70 100Z"
            fill="oklch(0.55 0.22 25 / 0.2)"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth="2"
          />
          <path
            d="M95 120C95 120 95 125 95 130C95 135 97.5 137.5 100 137.5C102.5 137.5 105 135 105 130C105 125 105 120 105 120"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth="2"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2">All caught up</h3>
      <p className="text-muted-foreground max-w-md">No new notifications. Your projects are quiet. Maybe too quiet.</p>
    </div>
  )
}
