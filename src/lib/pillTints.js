// Same hue, four intensities. Classes are written out in full so Tailwind
// can see them; the order is shuffled so neighbouring pills rarely match.
const PILL_BASE = 'px-2 py-1 border text-[11px] font-medium rounded-lg transition-colors cursor-default';
const PINK_TINTS = [
    'bg-primary-soft/80 border-primary-strong/20 text-foreground hover:bg-primary-soft',
    'bg-primary/80 border-primary-strong/25 text-foreground hover:bg-primary',
    'bg-primary-deep/35 border-primary-strong/30 text-foreground hover:bg-primary-deep/50',
    'bg-primary-soft border-primary-strong/25 text-foreground hover:bg-primary/70',
];
// Soft end of the RAL 6019 pastel green ramp: #EFF4EC, #D4E1CC, #C6D8BA, #B9CEAC.
const MATCHA_TINTS = [
    'bg-[#D4E1CC] border-[#9CB08C]/45 text-[#45573A] hover:bg-[#C6D8BA]',
    'bg-[#C6D8BA] border-[#9CB08C]/50 text-[#45573A] hover:bg-[#B9CEAC]',
    'bg-[#EFF4EC] border-[#B9CEAC] text-[#4F6143] hover:bg-[#D4E1CC]',
    'bg-[#B9CEAC] border-[#9CB08C]/55 text-[#3F5034] hover:bg-[#A9C09A]',
];
const TINT_ORDER = [1, 3, 0, 2, 3, 1, 2, 0];
const tintedPill = (tints) => (index) => `${PILL_BASE} ${tints[TINT_ORDER[index % TINT_ORDER.length]]}`;
export const pinkPill = tintedPill(PINK_TINTS);
export const matchaPill = tintedPill(MATCHA_TINTS);
