import './App.scss'
import style from './App.module.scss'
import { Routes, Route } from 'react-router'

import Home from './pages/Home/Home'
import Header from './wedgets/Header/Header'
import Setting from './wedgets/Setting/Setting'

export default function App() {
  return (
    <div className={style.app}>
      {/* <Header /> */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Setting />
      </main>
    </div>
  )
}
