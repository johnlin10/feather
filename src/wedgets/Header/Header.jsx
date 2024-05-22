import style from './Header.module.scss'

export default function Header() {
  return (
    <div className={style.header} onClick={() => window.location.reload(true)}>
      <div className={style.logo}>
        <img src="/feather_icon_noborder_64.png" alt="" />
        <h1>Feather</h1>
      </div>
    </div>
  )
}
