import { useEffect } from 'react'

interface PortalContentProps {
  position: string
  ref?: React.Ref<HTMLDivElement>
}

function PortalContent({ position, ref }: PortalContentProps) {
  useEffect(() => {
    console.log(`✅ ${position} Portal useEffect mounted`)
    return () => {
      console.log(`❌ ${position} Portal useEffect unmounted`)
    }
  }, [position])

  const getContentText = () => {
    switch (position) {
      case 'last':
        return 'Last Content (inside target, at end)'
      case 'first':
        return 'First Content (inside target, at beginning)'
      case 'before':
        return 'Before Content (sibling, before target)'
      case 'after':
        return 'After Content (sibling, after target)'
      default:
        return `${position} Content`
    }
  }

  return (
    <div ref={ref} className={`portal-content ${position}`}>
      {getContentText()}
    </div>
  )
}

export default PortalContent
