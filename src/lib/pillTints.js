// Same hue, four intensities. Classes are written out in full so Tailwind
// can see them; the order is shuffled so neighbouring pills rarely match.
const PILL_BASE = 'px-2 py-1 border text-[11px] font-medium rounded-lg transition-colors cursor-default';
// Every pink pill is the same very light, fully opaque pink.
const PINK_PILL = 'bg-[#FFF0F2] border-primary text-foreground';
// Uncoloured: the tool's own logo carries the colour.
const PLAIN_PILL = 'bg-white border-border text-foreground';
// Soft end of the RAL 6019 pastel green ramp: #EFF4EC, #D4E1CC, #C6D8BA, #B9CEAC.
const MATCHA_TINTS = [
    'bg-[#D4E1CC] border-[#9CB08C]/45 text-[#45573A] hover:bg-[#C6D8BA]',
    'bg-[#C6D8BA] border-[#9CB08C]/50 text-[#45573A] hover:bg-[#B9CEAC]',
    'bg-[#EFF4EC] border-[#B9CEAC] text-[#4F6143] hover:bg-[#D4E1CC]',
    'bg-[#B9CEAC] border-[#9CB08C]/55 text-[#3F5034] hover:bg-[#A9C09A]',
];
const TINT_ORDER = [1, 3, 0, 2, 3, 1, 2, 0];
const tintedPill = (tints) => (index) => `${PILL_BASE} ${tints[TINT_ORDER[index % TINT_ORDER.length]]}`;
export const pinkPill = () => `${PILL_BASE} ${PINK_PILL}`;
export const plainPill = () => `${PILL_BASE} ${PLAIN_PILL}`;
export const matchaPill = tintedPill(MATCHA_TINTS);
