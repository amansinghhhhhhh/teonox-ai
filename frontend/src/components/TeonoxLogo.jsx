import React from 'react';
import { NAV } from '@/constants/testIds';

export const TeonoxLogo = ({ variant = 'dark', size = 32, className = '' }) => {
    return (
        <img
            data-testid={NAV.headerLogo}
            src="/asserts/Teonox.ai_logo_white.png"
            alt="teonox.ai logo"
            height={size}
            className={className}
            style={{ width: 'auto', height: size }}
        />
    );
};

export default TeonoxLogo;
