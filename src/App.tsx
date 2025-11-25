import './App.css'
import { Button } from '@ledgerhq/ldls-ui-react'

function App() {
  return (
    <div className='flex flex-col items-center justify-center w-full h-screen'>
      <Button appearance='accent' size='sm'>Click me</Button>
      
      <div className='mt-12 bg-error-hover size-112'>test tokens</div>
    </div>
  )
}

export default App
