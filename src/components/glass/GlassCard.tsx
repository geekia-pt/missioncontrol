import { HTMLAttributes, forwardRef, CSSProperties } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  level?: 'subtle' | 'base' | 'raised' | 'overlay'
  noBorder?: boolean
}

const levelBlur = {
  subtle: 'blur(4px)',
  base: 'blur(12px)',
  raised: 'blur(16px)',
  overlay: 'blur(24px)',
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ style, className, level = 'base', noBorder = false, ...props }, ref) => {
    const glassStyle: CSSProperties = {
      background: `var(--glass-${level}-bg)`,
      backdropFilter: levelBlur[level],
      WebkitBackdropFilter: levelBlur[level],
      borderRadius: 'var(--radius-lg)',
      transition: 'all 200ms ease',
      border: noBorder ? 'none' : '1px solid var(--glass-border)',
      ...style,
    }

    return (
      <div
        ref={ref}
        className={className}
        style={glassStyle}
        {...props}
      />
    )
  }
)
GlassCard.displayName = 'GlassCard'
