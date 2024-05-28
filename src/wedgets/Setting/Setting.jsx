import style from './Setting.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

export default function Setting() {
  return (
    <div className={style.view}>
      <div className={style.container}>
        <div className={style.content}>
          <h1>關於 Feather</h1>
          <p>
            Feather 是一個簡易的天氣概覽 Web
            App，可以通過定位，顯示距離使用者最近的氣象站數據。也能查看全台所有氣象站的數據。
          </p>
          <p>更多功能，敬請期待！</p>
        </div>
        <div className={style.links}>
          <a
            href="https://github.com/johnlin10/feather"
            target="_blank"
            rel="noreferrer"
            title="Feather Github"
          >
            <div className={style.link}>
              <FontAwesomeIcon icon={faGithub} /> <span>GitHub</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
