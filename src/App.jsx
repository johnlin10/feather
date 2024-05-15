import './App.scss'
import style from './App.module.scss'
import { Routes, Route } from 'react-router'

import Home from './pages/Home/Home'
import Bustrack from './pages/Bustrack/Bustrack'

export default function App() {
  return (
    <div className={style.app}>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feather" element={<Bustrack />} />
        </Routes>
      </main>
    </div>
  )
}