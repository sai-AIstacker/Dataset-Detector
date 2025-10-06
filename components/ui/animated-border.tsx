import type * as React from "react"
import { cn } from "@/lib/utils"

type AnimatedBorderProps = React.PropsWithChildren<{
  className?: string
}>

export function AnimatedBorder({ className, children }: AnimatedBorderProps) {
  return (
    <div className={cn("neon-square relative rounded-xl", className)}>
      <div className="relative rounded-xl">{children}</div>
    </div>
  )
}
