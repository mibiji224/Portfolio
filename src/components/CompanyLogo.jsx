import { Building2 } from 'lucide-react'

// Company logo tile. Put the image path in the role's `logo` field (profile.jsx, or
// the dashboard row); until then a neutral dashed placeholder holds its place.
const SIZES = {
  sm: { box: 'h-9 w-9', icon: 'h-4 w-4' },
  md: { box: 'h-11 w-11', icon: 'h-5 w-5' },
}

const CompanyLogo = ({ item, size = 'md' }) => {
  const s = SIZES[size]
  return (
    <span
      className={`flex ${s.box} shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-background ${
        item.logo ? 'border-primary' : 'border-dashed border-primary-strong/40 text-primary-strong/60'
      }`}
    >
      {item.logo ? (
        <img src={item.logo} alt={`${item.company} logo`} className="h-full w-full object-contain p-1.5" />
      ) : (
        <Building2 className={s.icon} aria-label="Company logo placeholder" />
      )}
    </span>
  )
}

export default CompanyLogo
