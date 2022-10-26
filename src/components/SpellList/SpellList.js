import { useState } from 'react';
import { SPELLS } from '../../data/spells';
import { getSpellId } from '../../util/spell';
import { RemoveButton } from '../RemoveButton/RemoveButton';
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
    const [ componentFilters, setComponentFilters ] = useState({});

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
        const { v, s, m, g, c} = componentFilters;

        return (
            (v === undefined || (v === true && !!components.v) || (v === false && !components.v))
            && (s === undefined || (s === true && !!components.s) || (s === false && !components.s))
            && (m === undefined || (m === true && !!components.m) || (m === false && !components.m))
            && (g === undefined || (g === true && !!components?.m?.cost) || (g === false && !components?.m?.cost))
            && (c === undefined || (c === true && !!components?.m?.consume) || (c === false && !components?.m?.consume))
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
        const value = componentFilters[k];
        const newValue = value === true ? false : (value === false ? undefined : true);

        setComponentFilters({
            ...componentFilters,
            [k]: newValue
        });
    };

    return (
        <div className='SpellList'>
            <div className='search'>
                <input 
                    type="text"
                    placeholder='Search...'
                    value={searchString}
                    onChange={e => setSearchString(e.target.value)}
                />
                <button className='fas fa-times' onClick={() => setSearchString('')} />
            </div>
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
                            className={componentFilters[COMPONENTS[k]] === true ? 'active' : (componentFilters[COMPONENTS[k]] === false ? 'negative' : '')}
                            onClick={() => handleClickComponentFilter(COMPONENTS[k])}
                        >   
                            {k}
                        </button>
                    ))}
                </div>
                <div className='buttonGroup col2' style={{marginTop: '-4px'}}>
                    <button
                        className={componentFilters?.g === true ? 'active' : (componentFilters?.g === false ? 'negative' : '')}
                        onClick={() => handleClickComponentFilter('g')}
                    >
                        M (gp)
                    </button>
                    <button
                        className={componentFilters?.c === true ? 'active' : (componentFilters?.c === false ? 'negative' : '')}
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
                        <RemoveButton onClick={() => onRemove(spell)} />
                    </div>
                ))}
            </div>
        </div>
    );
};