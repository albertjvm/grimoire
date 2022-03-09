import { useContext } from 'react';
import { SpellListsContext } from '../../context/SpellListsContext';
import './ListModal.scss';

export const ListModal = ({ top, left, open, onClose, onSelect }) => {
    const { lists } = useContext(SpellListsContext);
    
    const handleWrapperClick = (e) => {
        e.stopPropagation();
        onClose();
    };

    const handleModalClick= (e) => {
        e.stopPropagation();
    };

    return (
        <div className="ListModal-Wrapper"  onClick={handleWrapperClick}>
            <div className={`ListModal ${open ? 'open' : ''}`}  onClick={handleModalClick} style={{
                top, left
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