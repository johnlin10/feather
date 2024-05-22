import style from './BorderShadow.module.scss'

export default function BorderShadow({ top, right, bottom, left }) {
  return (
    <div className={style.borderShadow}>
      <div
        className={style.top}
        style={{
          boxShadow: `0 0 ${top.blur}px ${top.blur / 2}px ${top.color}`,
        }}
      ></div>
      <div
        className={style.bottom}
        style={{
          boxShadow: `0 0 ${bottom.blur}px ${bottom.blur / 2}px ${
            bottom.color
          }`,
        }}
      ></div>
      <div
        className={style.left}
        style={{
          boxShadow: `0 0 ${left.blur}px ${left.blur / 2}px ${left.color}`,
        }}
      ></div>
      <div
        className={style.right}
        style={{
          boxShadow: `0 0 ${right.blur}px ${right.blur / 2}px ${right.color}`,
        }}
      ></div>
    </div>
  )
}
