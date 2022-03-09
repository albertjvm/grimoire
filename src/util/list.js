export const addSpellToList = ({listName, spellId}) => {
    console.log('adding', spellId, 'to', listName);
    const spells = getList(listName) || [];

    setList(listName, [
        ...spells,
        spellId
    ]);
};

const setList = (listName, spells) => {
    window.localStorage.setItem(listName, JSON.stringify(spells));
};

export const getList = (listName) => {
    const jsonString = window.localStorage.getItem(listName);

    if (jsonString) {
        return JSON.parse(jsonString);
    }
    
    return null;
};