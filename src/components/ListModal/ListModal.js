import { useContext, useEffect, useState, useRef } from 'react';
import { SpellListsContext } from '../../context/SpellListsContext';
import './ListModal.scss';

export const ListModal = ({ top, left, open, onClose, onSelect }) => {
    const [ x, setX ] = useState(left);
    const [ y, setY ] = useState(top);
    const { lists } = useContext(SpellListsContext);
    const ref = useRef(null);
    
    const handleWrapperClick = (e) => {
        e.stopPropagation();
        onClose();
    };

    const handleModalClick= (e) => {
        e.stopPropagation();
    };

    useEffect(() => {
        setX(Math.min(left, window.screen.width - ref.current.offsetWidth));
        setY(Math.min(top, window.screen.height - ref.current.offsetHeight));
    }, [left, top, ref]);

    return (
        <div className="ListModal-Wrapper"  onClick={handleWrapperClick}>
            <div ref={ref} className={`ListModal ${open ? 'open' : ''}`}  onClick={handleModalClick} style={{
                top: y,
                left: x
            }}>
                <header>Add to a list:</header>
                {lists.map(({ name }) => (
                    <span
                        key={name}
                        className='ListModal-row'
                        onClick={() => onSelect(name)}
                    >
                        {name}
                    </span>
                ))}
            </div>
        </div>
    );
};