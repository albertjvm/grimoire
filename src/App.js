import './App.scss';
import { ActiveListProvider } from './context/ActiveListContext';
import { SpellListsProvider } from './context/SpellListsContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main } from './components/Main/Main';
import { SPELLS } from './data/spells';

function App() {

  return (
    <ActiveListProvider>
      <SpellListsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Main spells={SPELLS} />} />
            <Route path="/:spellId" element={<Main spells={SPELLS} />} />
          </Routes>
        </Router>
      </SpellListsProvider>
    </ActiveListProvider>
  );
}

export default App;
