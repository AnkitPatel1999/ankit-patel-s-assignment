import './App.css'
import Header from './components/common/Header'
import Hero from './components/hero/Hero'
import WatchList from './components/watch-list/WatchList'

function App() {

  return (
    <>
      <div className="ae-max-width-1440">
        <Header />
        <div className='ae-mx-28 ae-my-28'>
          <Hero />
          <WatchList />
        </div>
      </div>
    </>
  )
}

export default App
