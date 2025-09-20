import { useState } from 'react'
import './App.css'
import Header from './components/common/Header'
import Hero from './components/hero/Hero'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="ae-max-width-1440">
        <Header />
        <div className='ae-mx-28 ae-my-28'>
          <Hero />
        </div>
      </div>
    </>
  )
}

export default App
