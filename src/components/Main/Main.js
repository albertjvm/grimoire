import { useEffect, useState } from 'react';
import { SpellSearch, SpellDisplay, SpellLists } from "..";
import { useNavigate, useParams } from "react-router-dom";

const TABS = {
    SPELLS: 'SPELLS',
    LISTS: 'LISTS'
};

export const Main = ({ spells }) => {
    const navigate = useNavigate();
    const { spellId } = useParams();
    const [ activeSpell, setActiveSpell ] = useState(null);
    const [ activeTab, setActiveTab ] = useState(TABS.SPELLS)

    const handleSelectSpell = (spell) => {
        navigate(`/${getSpellId(spell)}`);
        setActiveSpell(spell);
    };

    const handleClose = () => {
        navigate("/");
        setActiveSpell(null);
    };

    const getSpellId = (spell) => {
        return spell.name.toLowerCase().replaceAll(/\W/g, '-');
    };

    useEffect(() => {
        if (spellId && !activeSpell) {
            setActiveSpell(spells.find(s => getSpellId(s) === spellId));
        }
    }, [activeSpell, spellId, spells]);

    return (
        <main className={`App ${!activeSpell ? 'open' : 'closed'}`}>
            <section className="App-left">
              <div className="App-tabs">
                {Object.values(TABS).map(t => (
                  <button
                    key={t}
                    className={`App-tab ${activeTab === t ? 'active': ''}`}
                    onClick={() => setActiveTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {activeTab === TABS.SPELLS && <SpellSearch spells={spells} onSelect={handleSelectSpell} inList={false} />}
              {activeTab === TABS.LISTS && <SpellLists onSelectSpell={handleSelectSpell} />}
            </section>
            <section className="App-right">
              {activeSpell && <SpellDisplay {...activeSpell} onClose={handleClose} />}
            </section>
          </main>
    );
};