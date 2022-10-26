import './SpellDisplay.scss';
import { SCHOOLS } from '../../data/schools';
import { CLASSES } from '../../data/classes';
import { Entry } from '../Entry/Entry';

export const SpellDisplay = ({
    name,
    level,
    school,
    source,
    page,
    classes,
    time,
    range,
    components,
    duration,
    meta,
    entries,
    entriesHigherLevel,
    onClose = () => {}
}) => {
    const levelDisplay = (level) => (
        level === 0 ? 'Cantrip'
        : `${level}${levelSuffix(level)}-level`
    );
    const levelSuffix = (level) => {
        switch (level) {
            case 1: return 'st';
            case 2: return 'nd';
            default: return 'th';
        }
    };
    const spellClasses = () => ([
        ...(classes?.fromClassList || []),
        ...(classes?.fromClassListVariant || []),
    ]).map(c => c.name);
    const classList = () => CLASSES.filter(c => spellClasses().includes(c))
        .sort((c1, c2) => c1.localeCompare(c2));
    const timeDisplay = () => (
        `${time[0].number} ${time[0].unit}${time[0].number !== 1 ? 's': ''} ${time[0]?.condition || ''}`
    );
    const rangeDisplay = () => {
        switch(range.type) {
            case 'point':
                return `${range.distance?.amount || ''} ${range.distance?.type}`;
            default:
                return `${range.distance?.amount || ''} ${range.distance?.type || ''} ${range.type}`;
        }
    };
    const comps = () => (
        [
            ...(components.v ? ['v'] : []),
            ...(components.s ? ['s'] : []),
            ...(!!components.m ? ['m**'] : []),
        ].join(', ')
    );
    const pastTense = {
        dispel: 'dispelled',
        trigger: 'triggered'
    }
    const durationDisplay = () => {
        switch(duration[0].type) {
            case 'timed':
                return `${duration[0].duration?.amount || ''} ${duration[0].duration?.type}`;
            case 'permanent':
                return `Until ${duration[0].ends.map(e => pastTense[e]).join(' or ')}`;
            default:
                return 'instant';
        }
    };
    const isConc = () => !!duration.find(({concentration}) => !!concentration);
    const isRitual = () => !!meta?.ritual;

    return (
        <div className="SpellDisplay">
            <button onClick={onClose}>«</button>
            <section className="SpellDisplay-body">
                <div className="row">
                    <h1>{name}</h1>
                    <h5>{source} p{page}</h5>
                </div>
                <h2>{
                    level === 0 ? `${SCHOOLS[school]} ${levelDisplay(level)}` : `${levelDisplay(level)} ${SCHOOLS[school]}`
                }</h2>
                <div className="row">
                    {classList().map(c => (
                        <h3 key={c} className='class'>{c}</h3>
                    ))}
                </div>
                <div className='flags'>
                    {isRitual() && <span>ritual</span>}
                    {isConc() && <span>concentration</span>}
                </div>
                <div className='castingInfo'>
                    <span className="label">Time</span>
                    <span className="value">{timeDisplay()}</span>
                    <span className="label">Range</span>
                    <span className="value">{rangeDisplay()}</span>
                    <span className="label">Comp.</span>
                    <span className="value">{comps()}</span>
                    <span className="label">Duration</span>
                    <span className="value">{durationDisplay()}</span>
                </div>
                {!!components.m && <div className='material'>**{components.m?.text || components.m}</div>}
                <div className='text'>
                    {entries.map((e, i) => <Entry key={i} entry={e} />)}
                    {!!entriesHigherLevel && (entriesHigherLevel).map((e, i) => <Entry key={i} entry={e} />)}
                </div>
            </section>
        </div>
    );
};