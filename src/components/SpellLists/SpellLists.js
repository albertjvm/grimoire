import { useCallback, useContext, useEffect, useState } from 'react';
import { SpellList } from '..';
import { ActiveListContext } from '../../context/ActiveListContext';
import { SpellListsContext } from '../../context/SpellListsContext';
import { checkSpell, getList, removeSpellFromList } from '../../util/list';
import { getSpellId } from '../../util/spell';
import { ActiveList } from '../ActiveList/ActiveList';
import { RemoveButton } from '../RemoveButton/RemoveButton';
import './SpellLists.scss';

export const SpellLists = ({ onSelectSpell }) => {
    const { lists, addList, deleteList, exportLists } = useContext(SpellListsContext);
    const [ newName, setNewName ] = useState('');
    const { activeListName, setActiveListName } = useContext(ActiveListContext);
    const [ listSpells, setListSpells ] = useState([]);

    const handleClickNew = () => {
        if(!newName) return;

        addList({name: newName});
        setNewName('');
    };

    const handleRemoveSpell = (spell) => {
        removeSpellFromList({listName: activeListName,spellId:  getSpellId(spell)});
        syncSpells();
    };

    const handleCheckSpell = (spell) => {
        checkSpell({listName: activeListName,spellId:  getSpellId(spell)});
        syncSpells();
    };

    const syncSpells = useCallback(() => {
        setListSpells(getList(activeListName) || []);
    }, [activeListName]);

    useEffect(() => {
        syncSpells()
    }, [activeListName, syncSpells]);

    const sortedLists = () => (
        lists.sort((l1, l2) => l1.name.localeCompare(l2.name))
    );

    const handleKeyPress = e => {
        if (e.key === "Enter") {
            handleClickNew && handleClickNew();
        }
    };

    const handleDeleteList = (name) => {
        deleteList(name);
    };

    return (
        <div className="SpellLists">
            { activeListName ? <>
                <ActiveList />
                <SpellList spells={listSpells} onSelect={onSelectSpell} onRemove={handleRemoveSpell} onCheck={handleCheckSpell} /> 
            </>:<>
                <div className="SpellLists-newList">
                    <input 
                        type="text"
                        placeholder='New List'
                        value={newName}
                        onKeyPress={handleKeyPress}
                        onChange={e => setNewName(e.target.value)}
                    />
                    <button onClick={handleClickNew}>+</button>
                </div>
                <div className="SpellLists-lists">
                    {sortedLists().map(({ name }, i) => (
                        <div
                            key={i}
                            className='SpellLists-list'
                            onClick={() => setActiveListName(name)}
                        >
                            <span>{name}</span>
                            <RemoveButton onClick={() => handleDeleteList(name)} />
                        </div>
                    ))}
                </div>
                <div className="SpellLists-footer">
                    <button onClick={exportLists}>Export my data</button>
                </div>
            </>}
        </div>
    );
};