import { useEffect, useState } from "react";
import './RemoveButton.scss';

export const RemoveButton = ({ onClick }) => {
    const [active, setActive] = useState(false);

    const handleClickDelete = (e) => {
        e.stopPropagation();
        if (!active) {
            setActive(true);
        }
        else {
            setActive(false);
            onClick();
        }
    };

    useEffect(() => {
        if (active) {
            const timeout = setTimeout(() => {
                setActive(false);
            }, 2000);

            return () => clearTimeout(timeout);
        }
    }, [active]);

    return (
        <button className={`RemoveButton fas fa-trash ${active ? 'active' : ''}`} onClick={handleClickDelete} />
    );
}