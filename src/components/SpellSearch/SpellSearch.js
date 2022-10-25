import { useContext, useState } from 'react';
import './SpellSearch.scss';
import { ListModal } from '../ListModal/ListModal';
import { getSpellId } from '../../util/spell';
import { addSpellToList, listContainsSpell } from '../../util/list';
import { CLASSES } from '../../data/classes';
import { SCHOOLS } from '../../data/schools';
import { SOURCES } from '../../data/sources';
import { ActiveListContext } from '../../context/ActiveListContext';
import { ActiveList } from '../ActiveList/ActiveList';

const COMPONENTS = {
    V: 'v',
    S: 's',
    M: 'm'
};

export const SpellSearch = ({ 
    spells = [], 
    onSelect
}) => {
    const { 
        activeListName, 
        activeListSpells,
        addSpellToActiveList,
        removeSpellFromActiveList 
    } = useContext(ActiveListContext);
    const [ spellToAdd, setSpellToAdd ] = useState(null);
    const [ modalCoords, setModalCoords ] = useState(null);
    const [ searchString, setSearchString ] = useState('');
    const [ classFilter, setClassFilter ] = useState(null);
    const [ schoolFilter, setSchoolFilter ] = useState(null);
    const [ sourceFilter, setSourceFilter ] = useState(null);
    const [ levelFilter, setLevelFilter ] = useState([]);
    const [ hideFilters, setHideFilters ] = useState(true);
    const [ componentFilters, setComponentFilters ] = useState([]);

    const filterByClass = ({classes}) => {
        if (!classFilter) return true;
        return ([
            ...(classes?.fromClassList || []),
            ...(classes?.fromClassListVariant || []),
        ]).map(c => c.name).includes(classFilter);
    };

    const filterBySource = ({source}) => {
        if (!sourceFilter) return true;
        return source === sourceFilter;
    };

    const filterBySchool = ({school}) => {
        if (!schoolFilter) return true;
        return school === schoolFilter;
    };

    const filterByLevel = ({level}) => {
        if (!levelFilter?.length) return true;
        return levelFilter.includes(level);
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

    const compareSpells = (s1, s2) => {
        if (s1.level === s2.level) {
            return s1.name.localeCompare(s2.name);
        }

        return s1.level - s2.level;
    };

    const filteredSpells = () => {
        const regex = new RegExp(searchString.toLowerCase());
        return spells.filter(({ name }) => regex.test(name.toLowerCase()))
        .filter(filterByClass)
        .filter(filterBySchool)
        .filter(filterBySource)
        .filter(filterByLevel)
        .filter(filterByComponent)
        // .filter(({duration}) => duration[0].type==='permanent')
        .sort(compareSpells)
    };

    // console.log(filteredSpells().map(s => s.components));

    const handleAdd = (e, s) => {
        if (activeListName) {
            if (listContainsSpell({listName: activeListName, spell: s})) {
                removeSpellFromActiveList(s);
            } else {
                addSpellToActiveList(s);
            }
        } else {
            const { pageX, pageY } = e;
            setModalCoords([pageY, pageX]);
            setSpellToAdd(s);
        }
    };

    const handleListSelect = (listName) => {
        addSpellToList({ listName, spellId: getSpellId(spellToAdd)});
        setModalCoords(null);
    };

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
        <div className='SpellSearch'>
            <div className='search'>
                <input 
                    type="text"
                    placeholder='Search...'
                    value={searchString}
                    onChange={e => setSearchString(e.target.value)}
                />
                <button className='fas fa-times' onClick={() => setSearchString('')} />
            </div>
            <div className={`SpellSearch-filters ${hideFilters ? 'collapsed' : ''}`}>
                <div className='buttonGroup col3'>
                    {CLASSES.map(c => (
                        <button
                            key={c}
                            className={classFilter === c ? 'active' : ''}
                            onClick={() => setClassFilter(classFilter === c ? null : c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>
                <div className='buttonGroup col4'>
                    {Object.keys(SCHOOLS).map(s => (
                        <button
                            key={s}
                            className={schoolFilter === s ? 'active' : ''}
                            onClick={() => setSchoolFilter(schoolFilter === s ? null : s)}
                        >
                            {SCHOOLS[s].slice(0,4)}
                        </button>
                    ))}
                </div>
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
                <div className='buttonGroup col7'>
                    {SOURCES.map(s => (
                        <button
                            key={s}
                            className={sourceFilter === s ? 'active' : ''}
                            onClick={() => setSourceFilter(sourceFilter === s ? null : s)}
                        >
                            {s}
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
            </div>
            <button 
                className={`SpellSearch-toggle fas fa-angle-double-${hideFilters ? 'down' : 'up'}`} 
                onClick={() => setHideFilters(!hideFilters)}
            />
            { activeListName &&
                <ActiveList />
            }
            <div className='SpellSearch-spells'>
                {filteredSpells().map((spell, i) => (
                    <div key={i} className='SpellSearch-row'>
                        <span 
                            className="SpellSearch-spell"
                            onClick={() => onSelect(spell)}
                        >
                            <span className='level'>{spell.level}</span>{spell.name}
                        </span>
                        <button 
                            className={`add fas fa-${activeListSpells?.find(s => s.name === getSpellId(spell)) ? 'check' : 'plus'}`}
                            onClick={(e) => handleAdd(e, spell)} 
                        />
                    </div>
                ))}
            </div>
            {modalCoords &&
                <ListModal
                    open={!!modalCoords}
                    top={modalCoords && modalCoords[0]}
                    left={modalCoords && modalCoords[1]}
                    onClose={() => {
                        setModalCoords(null);
                    }}
                    onSelect={handleListSelect}
                />
            }
        </div>
    );
};