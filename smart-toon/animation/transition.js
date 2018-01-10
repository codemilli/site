function addTransitionAnimation($block, $imgObj, animation, ratio) {
  const {start_at, end_at} = animation
  const idx = $block.data('idx')
  const top = Number(($imgObj.css('top') || '0px').replace('px', '') || 0)

  const onEvent = () => {
    const windowTop = $(document).scrollTop() + $(window).height()
    const offsetTop = $block.offset().top + top
    const startAt = offsetTop + (start_at * ratio)
    const endAt = offsetTop + (end_at * ratio)
    const range = endAt - startAt
    const nowY = windowTop - startAt

    let {before_x, before_y, after_x, after_y} = animation

    before_x *= ratio
    before_y *= ratio
    after_x *= ratio
    after_y *= ratio

    let valueX = before_x
    let valueY = before_y

    if (nowY > range) {
      valueX = after_x
      valueY = after_y
    }

    if (nowY >= 0 && nowY <= range) {
      const progress = nowY / range
      const diffX = after_x - before_x
      const diffY = after_y - before_y

      valueX = valueX + (progress * diffX)
      valueY = valueY + (progress * diffY)
    }

    const preData = $imgObj.data('transform') || {}
    const postData = Object.assign(preData, {
      "translate3d": {
        x: valueX,
        y: valueY,
        z: 0
      }
    })

    $imgObj.data('transform', postData)
    const transform = $imgObj.data('transform')
    const {translate3d, scale = 1} = transform


    requestAnimationFrame(() => {
      $imgObj.css({
        'transform': `translate3d(${translate3d.x}px, ${translate3d.y}px, 0px) scale(${scale})`
      })
    })
  }

  window.addEventListener('scroll', onEvent, {
    passive: true
  })
  $(document).ready(onEvent)
}
