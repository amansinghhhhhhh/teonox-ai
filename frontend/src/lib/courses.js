// Shared course metadata helpers (matches /api/courses canonical IDs).
export const COURSE_ICON_BY_ID = {
    'ai-baat-prompt-engg': 'Sparkles',
    'ai-social-media-marketing': 'Megaphone',
    'ai-branding': 'Palette',
    'ai-ui-ux': 'Layers',
    'ai-digital-marketing': 'LineChart',
    'ai-seo': 'Search',
    'ai-in-depth-technical': 'Cpu',
};

export function badgeTier(p) {
    if (p >= 90) return { label: 'Most Recommended', bg: '#16A34A22', fg: '#86EFAC', fg2: '#A7F3D0', dot: '#22C55E' };
    if (p >= 70) return { label: 'Strong Match', bg: '#84CC1622', fg: '#BEF264', fg2: '#D9F99D', dot: '#84CC16' };
    if (p >= 50) return { label: 'Good Fit', bg: '#F59E0B22', fg: '#FCD34D', fg2: '#FDE68A', dot: '#F59E0B' };
    if (p >= 30) return { label: 'Worth Exploring', bg: '#F9731622', fg: '#FDBA74', fg2: '#FED7AA', dot: '#F97316' };
    return { label: 'Not Relevant', bg: '#EF444422', fg: '#FCA5A5', fg2: '#FECACA', dot: '#EF4444' };
}

export const SEVERITY_COLORS = {
    low: { bg: '#16A34A22', fg: '#86EFAC', stroke: '#22C55E', label: 'Low risk' },
    medium: { bg: '#F59E0B22', fg: '#FCD34D', stroke: '#F59E0B', label: 'Medium risk' },
    high: { bg: '#F9731622', fg: '#FDBA74', stroke: '#F97316', label: 'High risk' },
    critical: { bg: '#EF444422', fg: '#FCA5A5', stroke: '#EF4444', label: 'Critical risk' },
};

export const AUDIENCE_OPTIONS = [
    { value: 'student', label: 'Degree / school student', icon: 'GraduationCap' },
    { value: 'professional', label: 'Working professional', icon: 'Briefcase' },
    { value: 'business_owner', label: 'Business owner', icon: 'Building2' },
    { value: 'parent', label: 'Parent (for kids)', icon: 'Users' },
];
