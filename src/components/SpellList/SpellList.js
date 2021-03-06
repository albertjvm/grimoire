import { useState } from 'react';
import { SPELLS } from '../../data/spells';
import { getSpellId } from '../../util/spell';
import './SpellList.scss';

export const SpellList = ({ 
    spells = [], 
    onSelect, 
    onRemove = () => {},
    onCheck = () => {}
}) => {
    const [ searchString, setSearchString ] = useState('');
    const [ levelFilter, setLevelFilter ] = useState([]);
    const [ filterSelected, setFilterSelected ] = useState(false);

    const filterByLevel = ({level}) => {
        if (!levelFilter?.length) return true;
        return levelFilter.includes(level);
    };

    const filterBySelected = (spell) => {
        if(!filterSelected) return true;
        return spells.find(s => s.name === getSpellId(spell))?.selected;
    };

    const compareSpells = (s1, s2) => {
        if (s1.level === s2.level) {
            return s1.name.localeCompare(s2.name);
        }

        return s1.level - s2.level;
    };

    const filteredSpells = () => {
        const regex = new RegExp(searchString.toLowerCase());
        return SPELLS
        .filter(s => spells.find(ls => ls.name === getSpellId(s)))
        .filter(({ name }) => regex.test(name.toLowerCase()))
        .filter(filterByLevel)
        .filter(filterBySelected)
        .sort(compareSpells)
    };
    const isChecked = (name) => (
        spells.find(s => s.name === name)?.selected
    );

    return (
        <div className='SpellList'>
            <input 
                type="text"
                placeholder='Search...'
                value={searchString}
                onChange={e => setSearchString(e.target.value)}
            />
            <div className='SpellList-filters'>
                <div className='buttonGroup col5'>
                    {(new Array(10).fill(0).map((_, i) => i)).map(l => (
                        <button
                            key={l}
                            className={levelFilter.includes(l) ? 'active' : ''}
                            onClick={() => setLevelFilter(
                                levelFilter.includes(l) ? 
                                    levelFilter.filter(lf => lf !== l) 
                                : 
                                    [...levelFilter, l]
                            )}
                        >
                            {l}
                        </button>
                    ))}
                </div>
                <div className='buttonGroup col3'>
                    <button
                        className={filterSelected ? 'active' : ''}
                        onClick={() => setFilterSelected(!filterSelected)}
                    >
                        Prepared ({spells.filter(s => s.selected).length})
                    </button>
                </div>
            </div>
            <div className='SpellList-spells'>
                {filteredSpells().map((spell, i) => (
                    <div key={i} className='SpellList-row'>
                        <span 
                            className={`SpellList-checked fas fa-${isChecked(getSpellId(spell)) ? 'check-circle' : 'circle'}`} 
                            onClick={() => onCheck(spell)}
                        />
                        <span 
                            className="SpellList-spell"
                            onClick={() => onSelect(spell)}
                        >
                            <span className='level'>{spell.level}</span>{spell.name}
                        </span>
                        <button className='remove fas fa-trash' onClick={() => onRemove(spell)} />
                    </div>
                ))}
            </div>
        </div>
    );
};