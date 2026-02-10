import { useState } from 'react';
import './App.css';
import { Button, ThemeProvider } from '@ledgerhq/lumen-ui-react';
import TablePocGroupingTanstackExample from './components/TablePocGroupingTanstackExample';
import TablePocSubGroupsAlternative from './components/TablePocSubGroupsAlternative';
import TablePocSubGroups from './components/TablePocSubGroups';
import { Sandbox } from './components/Sandbox';

type TableView = 'grouping-example' | 'subgroups-alternative' | 'subgroups' | 'sandbox';

function App() {
  const [activeTable, setActiveTable] = useState<TableView>('grouping-example');

  return (
  <ThemeProvider defaultMode="dark">
    <div className='p-4'>
      <div className='flex gap-2 mb-4'>
        <Button
          onClick={() => setActiveTable('grouping-example')}
        >
          Grouping Example
        </Button>
        
        <Button
          onClick={() => setActiveTable('subgroups-alternative')}
        >
          SubGroups Alternative
        </Button>
        
        <Button
          onClick={() => setActiveTable('subgroups')}
        >
          SubGroups
        </Button>
        <Button
          onClick={() => setActiveTable('sandbox')}
        >
          App
        </Button>
      </div>

      <div>
        {activeTable === 'grouping-example' && <TablePocGroupingTanstackExample />}
        {activeTable === 'subgroups-alternative' && <TablePocSubGroupsAlternative />}
        {activeTable === 'subgroups' && <TablePocSubGroups />}
        {activeTable === 'sandbox' && <Sandbox />}
      </div>
    </div>
    </ThemeProvider>
  );
}

export default App;
