import { useContext } from 'react';
import { ActiveListContext } from '../../context/ActiveListContext';
import './ActiveList.scss';

export const ActiveList = () => {
    const { activeListName, clearActiveList } = useContext(ActiveListContext);

    return (
        <div className="ActiveList">
            <span>active list:</span>
            <h4>{activeListName}</h4>
            <button 
                className="fas fa-times"
                onClick={clearActiveList}
            />
        </div>
    )
};