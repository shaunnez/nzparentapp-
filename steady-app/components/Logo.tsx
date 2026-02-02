'use client'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 40, text: 'text-2xl' },
  }

  const { icon, text } = sizes[size]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Steady icon - two overlapping circles representing connection/support */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="steady-icon"
      >
        {/* Background circle - represents the parent/support */}
        <circle
          cx="16"
          cy="20"
          r="12"
          className="fill-primary-500"
          opacity="0.9"
        />
        {/* Foreground circle - represents the child */}
        <circle
          cx="24"
          cy="20"
          r="10"
          className="fill-primary-300"
          opacity="0.9"
        />
        {/* Connection point - the overlap area gets a subtle highlight */}
        <circle
          cx="20"
          cy="20"
          r="4"
          className="fill-white"
          opacity="0.6"
        />
      </svg>

      {showText && (
        <span className={`font-semibold text-slate-800 ${text}`}>
          Steady
        </span>
      )}
    </div>
  )
}
