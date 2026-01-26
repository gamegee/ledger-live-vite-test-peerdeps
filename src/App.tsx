import { useState } from 'react';
import './App.css';
import { ThemeProvider } from '@ledgerhq/lumen-ui-react';

type TableView = 'grouping-example' | 'subgroups-alternative' | 'subgroups' | 'sandbox';

function App() {
  const [activeTable, setActiveTable] = useState<TableView>('grouping-example');

  return (
  <ThemeProvider colorScheme="light">
    
    </ThemeProvider>
  );
}

export default App;
