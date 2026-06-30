import React, { createContext, useContext, useState, useCallback } from 'react';
import { MasterclassSignupDrawer } from './MasterclassSignupDrawer';

const MasterclassContext = createContext({ open: () => {} });

export const MasterclassProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [source, setSource] = useState('home_masterclass');

    const open = useCallback((src) => {
        if (src) setSource(src);
        setIsOpen(true);
    }, []);

    const value = { open, isOpen };

    return (
        <MasterclassContext.Provider value={value}>
            {children}
            <MasterclassSignupDrawer open={isOpen} onOpenChange={setIsOpen} source={source} />
        </MasterclassContext.Provider>
    );
};

export const useMasterclass = () => useContext(MasterclassContext);
