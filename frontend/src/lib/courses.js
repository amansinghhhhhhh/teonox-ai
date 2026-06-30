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
    if (p >= 90) return { label: 'Most Recommended', bg: '#DCFCE7', fg: '#166534', dot: '#16A34A' };
    if (p >= 70) return { label: 'Strong Match', bg: '#ECFCCB', fg: '#365314', dot: '#84CC16' };
    if (p >= 50) return { label: 'Good Fit', bg: '#FEF3C7', fg: '#92400E', dot: '#F59E0B' };
    if (p >= 30) return { label: 'Worth Exploring', bg: '#FFEDD5', fg: '#9A3412', dot: '#F97316' };
    return { label: 'Not Relevant', bg: '#FEE2E2', fg: '#991B1B', dot: '#EF4444' };
}

export const SEVERITY_COLORS = {
    low: { bg: '#DCFCE7', fg: '#166534', stroke: '#16A34A', label: 'Low risk' },
    medium: { bg: '#FEF3C7', fg: '#92400E', stroke: '#F59E0B', label: 'Medium risk' },
    high: { bg: '#FFEDD5', fg: '#9A3412', stroke: '#F97316', label: 'High risk' },
    critical: { bg: '#FEE2E2', fg: '#991B1B', stroke: '#EF4444', label: 'Critical risk' },
};

export const AUDIENCE_OPTIONS = [
    { value: 'student', label: 'Degree / school student', icon: 'GraduationCap' },
    { value: 'professional', label: 'Working professional', icon: 'Briefcase' },
    { value: 'business_owner', label: 'Business owner', icon: 'Building2' },
    { value: 'parent', label: 'Parent (for kids)', icon: 'Users' },
];
