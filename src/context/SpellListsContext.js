import React, { useEffect, useState } from 'react';
import { getList } from '../util/list';

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

    const exportLists = () => {
        const filename = 'grimoire.json';
        const jsonStr = JSON.stringify(lists.map(({name}) => ({
            name,
            list: getList(name)
        })));

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    return (
        <SpellListsContext.Provider value={{
            lists,
            addList,
            deleteList,
            exportLists
        }}>
            {children}
        </SpellListsContext.Provider>
    );
};