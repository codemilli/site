function addTransitionAnimation($block, $imgObj, item, ratio) {
  const {animation, start_at, end_at} = item

  const onEvent = () => {
    const windowTop = $(document).scrollTop()
    const offsetTop = $block.offset().top
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

    if (nowY >= 0 && nowY <= range) {
      const progress = nowY / range
      const diffX = after_x - before_x
      const diffY = after_y - before_y

      valueX = valueX + (progress * diffX)
      valueY = valueY + (progress * diffY)
    }

    if (nowY > range) {
      valueX = after_x
      valueY = after_y
    }

    $imgObj.css({'transform': `translate3d(${valueX}px, ${valueY}px, 0px)`})
  }

  $(window).on('scroll', onEvent)
  $(document).ready(onEvent)
}
