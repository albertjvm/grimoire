import { getSpellId } from "./spell";

export const addSpellToList = ({listName, spellId}) => {
    // console.log('adding', spellId, 'to', listName);
    const spells = getList(listName) || [];

    if (spells.find(s => s.name === spellId)) {
        console.log('list already contains', spellId);
        return;
    }

    setList(listName, [
        ...spells,
        {name: spellId, selected: false}
    ]);
};

export const checkSpell = ({listName, spellId}) => {
    const spells = (getList(listName) || []);
    const selected = spells.find(s => s.name === spellId)?.selected

    setList(listName, [
        ...(spells.filter(s => s.name !== spellId)),
        {name: spellId, selected: !selected}
    ]);
};

export const removeSpellFromList = ({listName, spellId}) => {
    // console.log('removing', spellId, 'from', listName);
    const spells = (getList(listName) || []).filter(s => s.name !== spellId);

    setList(listName, [
        ...spells
    ]);
};

export const listContainsSpell =({listName, spell}) => {
    return getList(listName)?.find(s => s.name === getSpellId(spell));
};

export const setList = (listName, spells) => {
    window.localStorage.setItem(listName, JSON.stringify(spells));
};

export const getList = (listName) => {
    const jsonString = window.localStorage.getItem(listName);

    if (jsonString) {
        const json = JSON.parse(jsonString);
        const list = json.map(item => (
            typeof item === 'string' ? ({
                name: item,
                selected: false
            }) : item
        ));
        return list;
    }
    
    return null;
};