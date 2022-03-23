import { useCallback, useContext, useEffect, useState } from 'react';
import { SpellList } from '..';
import { SpellListsContext } from '../../context/SpellListsContext';
import { SPELLS } from '../../data/spells';
import { getList, removeSpellFromList } from '../../util/list';
import { getSpellId } from '../../util/spell';
import './SpellLists.scss';

export const SpellLists = ({ onSelectSpell }) => {
    const { lists, addList } = useContext(SpellListsContext);
    const [ newName, setNewName ] = useState('');
    const [ activeListName, setActiveListName ] = useState(null);
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

    const syncSpells = useCallback(() => {
        const spellIds = (getList(activeListName) || []).map(s => s.name);
        setListSpells(SPELLS.filter((s) => spellIds.includes(getSpellId(s))));
    }, [activeListName]);

    useEffect(() => {
        syncSpells()
    }, [activeListName, syncSpells]);

    return (
        <div className="SpellLists">
            { activeListName ? <>
                <div className="SpellLists-header">
                    <h2>{activeListName}</h2>
                    <button className="fas fa-times" onClick={() => setActiveListName(null)} />
                </div>
                <SpellList spells={listSpells} onSelect={onSelectSpell} onRemove={handleRemoveSpell} /> 
            </>:<>
                <div className="SpellLists-lists">
                    {lists.map(({ name }, i) => (
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