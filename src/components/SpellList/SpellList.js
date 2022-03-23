import { useState } from 'react';
import './SpellList.scss';

export const SpellList = ({ 
    spells = [], 
    onSelect, 
    onRemove = () => {}
}) => {
    const [ searchString, setSearchString ] = useState('');
    const [ levelFilter, setLevelFilter ] = useState([]);

    const filterByLevel = ({level}) => {
        if (!levelFilter?.length) return true;
        return levelFilter.includes(level);
    };

    const compareSpells = (s1, s2) => {
        if (s1.level === s2.level) {
            return s1.name.localeCompare(s2.name);
        }

        return s1.level - s2.level;
    };

    const filteredSpells = () => {
        const regex = new RegExp(searchString.toLowerCase());
        return spells.filter(({ name }) => regex.test(name.toLowerCase()))
        .filter(filterByLevel)
        .sort(compareSpells)
    };

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
            </div>
            <div className='SpellList-spells'>
                {filteredSpells().map((spell, i) => (
                    <div key={i} className='SpellList-row'>
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