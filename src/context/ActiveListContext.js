import React, { useEffect, useState } from 'react';
import { getList, setList } from '../util/list';
import { getSpellId } from '../util/spell';

export const ActiveListContext = React.createContext();

export const ActiveListProvider = ({ children }) => {
    const [ activeListName, setActiveListName ] = useState(null);
    const [ activeListSpells, setActiveListSpells ] = useState([]);

    const clearActiveList = () => {
        setActiveListName(null);
    };

    const addSpellToActiveList = (spell) => {
        const spellId = getSpellId(spell);
        if (activeListSpells?.find(s => s.name === spellId)) {
            console.log('list already contains', spellId);
            return;
        }

        const newList = [
            ...(activeListSpells || []),
            {name: spellId, selected: false}
        ];

        setActiveListSpells(newList);
        setList(activeListName, newList);
    };

    const removeSpellFromActiveList = (spell) => {
        const spellId = getSpellId(spell);

        const newList = [
            ...(activeListSpells.filter(s => s.name !== spellId))
        ];

        setActiveListSpells(newList);
        setList(activeListName, newList);
    };

    useEffect(() => {
        setActiveListSpells(getList(activeListName));
    }, [activeListName]);

    return (
        <ActiveListContext.Provider value={{
            activeListName,
            setActiveListName,
            clearActiveList,
            activeListSpells,
            addSpellToActiveList,
            removeSpellFromActiveList
        }}>
            {children}
        </ActiveListContext.Provider>
    );
};