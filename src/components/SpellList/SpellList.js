import { useState } from 'react';
import { SPELLS } from '../../data/spells';
import { getSpellId } from '../../util/spell';
import './SpellList.scss';

const COMPONENTS = {
    V: 'v',
    S: 's',
    M: 'm'
};

export const SpellList = ({ 
    spells = [], 
    onSelect, 
    onRemove = () => {},
    onCheck = () => {}
}) => {
    const [ searchString, setSearchString ] = useState('');
    const [ levelFilter, setLevelFilter ] = useState([]);
    const [ filterSelected, setFilterSelected ] = useState(false);
    const [ componentFilters, setComponentFilters ] = useState([]);

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

    const filterByComponent = ({components}) => {
        if (!componentFilters?.length) return true;
        return (
            ( !componentFilters.includes('v') || !!components.v )
            && ( !componentFilters.includes('s') || !!components.s )
            && ( !componentFilters.includes('m') || !!components.m )
            && ( !componentFilters.includes('g') || !!components?.m?.cost )
            && ( !componentFilters.includes('c') || !!components?.m?.consume )
        );
    };

    const filteredSpells = () => {
        const regex = new RegExp(searchString.toLowerCase());
        return SPELLS
        .filter(s => spells.find(ls => ls.name === getSpellId(s)))
        .filter(({ name }) => regex.test(name.toLowerCase()))
        .filter(filterByLevel)
        .filter(filterBySelected)
        .filter(filterByComponent)
        .sort(compareSpells)
    };
    const isChecked = (name) => (
        spells.find(s => s.name === name)?.selected
    );

    const handleClickComponentFilter = (k) => {
        let newFilters = [];

        if (componentFilters.includes(k)) {
            newFilters = componentFilters.filter(c => c !== k);
        } else {
            newFilters = [...componentFilters, k];
        }

        setComponentFilters(newFilters);
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

                <div className='buttonGroup col3'>
                    {Object.keys(COMPONENTS).map(k => (
                        <button
                            key={k}
                            className={componentFilters.includes(COMPONENTS[k]) ? 'active' : ''}
                            onClick={() => handleClickComponentFilter(COMPONENTS[k])}
                        >   
                            {k}
                        </button>
                    ))}
                </div>
                <div className='buttonGroup col2' style={{marginTop: '-4px'}}>
                    <button
                        className={componentFilters.includes('g') ? 'active' : ''}
                        onClick={() => handleClickComponentFilter('g')}
                    >
                        M (gp)
                    </button>
                    <button
                        className={componentFilters.includes('c') ? 'active' : ''}
                        onClick={() => handleClickComponentFilter('c')}
                    >
                        M (consumed)
                    </button>
                </div>

                <div className='buttonGroup col2'>
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