import { AmountInput, Button } from '@ledgerhq/ldls-ui-react';
import { Android } from '@ledgerhq/ldls-ui-react/symbols';
import './App.css';



function App() {
  return (
    <div className='flex flex-col items-center justify-center w-full h-screen'>
      <Button icon={Android} asChild appearance='accent' size='sm'><a href='/'>Click me</a></Button>
      <AmountInput onChange={() => {}} value={0} />
      <div className='mt-12 bg-error-strong size-112'>test tokens</div>
      <div className='mt-12 bg-success-strong size-112'>test tokens</div>
      <div className='mt-12 bg-warning-strong size-112'>test tokens</div>
    </div>
  )
}

export default App
