import './App.css'
import { AmountInput, Button } from '@ledgerhq/ldls-ui-react'
import { Android } from '@ledgerhq/ldls-ui-react/symbols';
// import * as Octicons from '@primer/octicons-react'
// import { Camera } from 'lucide-react';


function App() {
  return (
    <div className='flex flex-col items-center justify-center w-full h-screen'>
      <Button icon={Android} asChild appearance='accent' size='sm'><a href='/'>Click me</a></Button>
      <AmountInput onChange={() => {}} value={0} />
      {/* <Octicons.AccessibilityIcon/>
      <Octicons.BellFillIcon/> */}
      {/* <Camera/> */}
      <div className='mt-12 bg-error-hover size-112'>test tokens</div>
    </div>
  )
}

export default App
