import { useState } from 'react';
import './App.scss';
import { SpellSearch, SpellDisplay, SpellLists } from "./components";
import { ActiveListProvider } from './context/ActiveListContext';
import { SpellListsProvider } from './context/SpellListsContext';
import { SPELLS } from './data/spells';

const TABS = {
  SPELLS: 'SPELLS',
  LISTS: 'LISTS'
}

function App() {
  const [ activeSpell, setActiveSpell ] = useState(null);
  const [ activeTab, setActiveTab ] = useState(TABS.SPELLS)

  return (
    <ActiveListProvider>
      <SpellListsProvider>
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
            {activeTab === TABS.SPELLS && <SpellSearch spells={SPELLS} onSelect={setActiveSpell} inList={false} />}
            {activeTab === TABS.LISTS && <SpellLists onSelectSpell={setActiveSpell} />}
          </section>
          <section className="App-right">
            {activeSpell && <SpellDisplay {...activeSpell} onClose={() => setActiveSpell(null)} />}
          </section>
        </main>
      </SpellListsProvider>
    </ActiveListProvider>
  );
}

export default App;
