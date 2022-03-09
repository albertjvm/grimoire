import { useState } from 'react';
import './SpellChooser.scss';
import { ListModal } from '../ListModal/ListModal';
import { getSpellId } from '../../util/spell';
import { addSpellToList } from '../../util/list';
import { CLASSES } from '../../data/classes';
import { SCHOOLS } from '../../data/schools';

export const SpellChooser = ({ spells = [], onSelect, showFilters = false }) => {
    const [ spellToAdd, setSpellToAdd ] = useState(null);
    const [ modalCoords, setModalCoords ] = useState(null);
    const [ searchString, setSearchString ] = useState('');
    const [ classFilter, setClassFilter ] = useState(null);
    const [ schoolFilter, setSchoolFilter ] = useState(null);
    const [ levelFilter, setLevelFilter ] = useState([]);

    const filterByClass = ({classes}) => {
        if (!classFilter) return true;
        return ([
            ...(classes?.fromClassList || []),
            ...(classes?.fromClassListVariant || []),
        ]).map(c => c.name).includes(classFilter);
    };

    const filterBySchool = ({school}) => {
        if (!schoolFilter) return true;
        return school === schoolFilter;
    };

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
        .filter(filterByClass)
        .filter(filterBySchool)
        .filter(filterByLevel)
        // .filter(({duration}) => duration[0].type==='permanent')
        .sort(compareSpells)
    };

    // console.log(filteredSpells().map(s => s.duration));

    const handleAdd = (e, s) => {
        const { offsetTop, offsetLeft, offsetHeight } = e.target;
        setModalCoords([offsetTop + offsetHeight, offsetLeft]);
        setSpellToAdd(s);
    };

    const handleListSelect = (listName) => {
        addSpellToList({ listName, spellId: getSpellId(spellToAdd)});
        setModalCoords(null);
    };

    return (
        <div className='SpellChooser'>
            <input 
                type="text"
                placeholder='Search...'
                value={searchString}
                onChange={e => setSearchString(e.target.value)}
            />
            {showFilters && 
                <div className='SpellChooser-filters'>
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
                </div>
            }
            <div className='SpellChooser-spells'>
                {filteredSpells().map((spell, i) => (
                    <div key={i} className='SpellChooser-row'>
                        <span 
                            className="SpellChooser-spell"
                            onClick={() => onSelect(spell)}
                        >
                            <span className='level'>{spell.level}</span>{spell.name}
                        </span>
                        <button onClick={(e) => handleAdd(e, spell)}>+</button>
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