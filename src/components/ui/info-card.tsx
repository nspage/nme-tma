import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { Button } from "./button"
import { ChevronRight } from "lucide-react"

interface InfoCardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  badges?: string[]
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
  children?: React.ReactNode
  variant?: "default" | "highlight"
}

export function InfoCard({
  title,
  description,
  icon,
  badges,
  action,
  className,
  children,
  variant = "default",
}: InfoCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        variant === "highlight" && "border-primary bg-primary/5",
        action && "cursor-pointer hover:border-primary",
        className
      )}
      onClick={action?.onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {icon && (
              <div
                className={cn(
                  "rounded-lg p-2",
                  variant === "highlight"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {icon}
              </div>
            )}
            <div>
              <CardTitle>{title}</CardTitle>
              {description && (
                <CardDescription className="mt-1.5">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {action && (
            <Button variant="ghost" size="icon" className="shrink-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {badges.map((badge) => (
              <Badge key={badge} variant="secondary">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}
