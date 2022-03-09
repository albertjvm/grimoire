import { useContext, useEffect, useState } from 'react';
import { SpellChooser } from '..';
import { SpellListsContext } from '../../context/SpellListsContext';
import { SPELLS } from '../../data/spells';
import { getList } from '../../util/list';
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

    useEffect(() => {
        const spellIds = getList(activeListName) || [];
        setListSpells(SPELLS.filter((s) => spellIds.includes(getSpellId(s))));
    }, [activeListName]);

    return (
        <div className="SpellLists">
            { activeListName && <SpellChooser spells={listSpells} onSelect={onSelectSpell} /> }
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
        </div>
    );
};