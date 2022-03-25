import { useCallback, useContext, useEffect, useState } from 'react';
import { SpellList } from '..';
import { ActiveListContext } from '../../context/ActiveListContext';
import { SpellListsContext } from '../../context/SpellListsContext';
import { checkSpell, getList, removeSpellFromList } from '../../util/list';
import { getSpellId } from '../../util/spell';
import { ActiveList } from '../ActiveList/ActiveList';
import './SpellLists.scss';

export const SpellLists = ({ onSelectSpell }) => {
    const { lists, addList } = useContext(SpellListsContext);
    const [ newName, setNewName ] = useState('');
    const { activeListName, setActiveListName, clearActiveList } = useContext(ActiveListContext);
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

    return (
        <div className="SpellLists">
            { activeListName ? <>
                <ActiveList />
                <SpellList spells={listSpells} onSelect={onSelectSpell} onRemove={handleRemoveSpell} onCheck={handleCheckSpell} /> 
            </>:<>
                <div className="SpellLists-lists">
                    {sortedLists().map(({ name }, i) => (
                        <div
                            key={i} 
                            className='SpellLists-list'
                            onClick={() => setActiveListName(name)}
                        >
                            {name}
                        </div>
                    ))}
                </div>
                <div className="SpellLists-footer">
                    <input 
                        type="text"
                        placeholder='New List'
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                    />
                    <button onClick={handleClickNew}>+</button>
                </div>
            </>}
        </div>
    );
};