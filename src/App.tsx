import { ThemeProvider } from './components/theme-provider'
import './App.css'
import Home from './components/Home'
import { Routes, Route } from 'react-router-dom'
import Clique from './components/Clique'
import Navbar from './components/Navbar'
import CreateClique from './components/CreateClique'
import About from './components/About'

function App() {

  return (
     
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className="App h-full">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/create" element={<CreateClique/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/clique/:id" element={<Clique/>}/>
          <Route path="*" element={<div>Nothing here</div>}/>
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
