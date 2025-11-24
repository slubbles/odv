import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: LucideIcon
    title: string
    description?: string
    action?: React.ReactNode
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    className,
    ...props
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50",
                className
            )}
            {...props}
        >
            {Icon && (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                </div>
            )}
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && (
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    {description}
                </p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    )
}
