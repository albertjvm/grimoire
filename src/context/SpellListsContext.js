import React, { useEffect, useState } from 'react';

export const SpellListsContext = React.createContext();

const KEY = 'lists';

export const SpellListsProvider = ({ children }) => {
    const [ lists, setLists ] = useState([]);

    useEffect(() => {
        const jsonString = window.localStorage.getItem(KEY);

        if (jsonString) {
            setLists(JSON.parse(jsonString));
        }
    }, []);

    const updateLists = (newLists) => {
        setLists(newLists);
        window.localStorage.setItem(KEY, JSON.stringify(newLists));
    };

    const addList = ({ name }) => {
        const existingList = lists.find(l => l.name === name);
        if (!existingList) {
            updateLists([
                ...lists,
                { name }
            ]);
        }
    };

    const deleteList = (name) => {
        updateLists([
            ...(lists.filter(l => l.name !== name))
        ]);
    };

    return (
        <SpellListsContext.Provider value={{
            lists,
            addList,
            deleteList
        }}>
            {children}
        </SpellListsContext.Provider>
    );
};