import { useEffect } from 'react'
import style from './Bustrack.module.scss'
import { useContext } from 'react'
import { AppContext } from '../../AppContext'

export default function Bustrack() {
  const { busNumber, setBusNumber } = useContext(AppContext)

  useEffect(() => {
    fetch('/bustrack/number', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ busNumber: busNumber }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        console.log(data) // 处理响应数据
      })
      .catch((error) => {
        console.error(
          'There has been a problem with your fetch operation:',
          error
        )
      })
  }, [busNumber])
  return (
    <div className={style.view}>
      <div className={style.container}></div>
    </div>
  )
}
