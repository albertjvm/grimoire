import { useState } from 'react';
import './App.scss';
import { SpellChooser, SpellDisplay, SpellLists } from "./components";
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
          {activeTab === TABS.SPELLS && <SpellChooser spells={SPELLS} onSelect={setActiveSpell} showFilters={true} />}
          {activeTab === TABS.LISTS && <SpellLists onSelectSpell={setActiveSpell} />}
        </section>
        <section className="App-right">
          {activeSpell && <SpellDisplay {...activeSpell} onClose={() => setActiveSpell(null)} />}
        </section>
      </main>
    </SpellListsProvider>
  );
}

export default App;
