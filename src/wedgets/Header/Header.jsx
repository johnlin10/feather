import style from './Header.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export default function Header() {
  return (
    <div className={style.header} onClick={() => window.location.reload(true)}>
      <div className={style.logo}>
        <img src="/feather_icon_noborder_64.png" alt="" />
        <h1>Feather</h1>
      </div>
      {/* <div className={style.features}>
        <button title=''>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div> */}
    </div>
  )
}
