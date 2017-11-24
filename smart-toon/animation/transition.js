function addTransitionAnimation($block, $imgObj, item, ratio) {
  const {animation, start_at, end_at} = item

  $(window).on('scroll', () => {
    const windowTop = $(document).scrollTop()
    const offsetTop = $block.offset().top
    const startAt = offsetTop + (start_at * ratio)
    const endAt = offsetTop + (end_at * ratio)

    const range = endAt - startAt
    const nowY = windowTop - startAt
    let valueX = null
    let valueY = null
    let {before_x, before_y, after_x, after_y} = animation
    before_x *= ratio
    before_y *= ratio
    after_x *= ratio
    after_y *= ratio

    if (nowY < 0) {
      valueX = before_x
      valueY = before_y
    }

    if (nowY >= 0 && nowY <= range) {
      const progress = nowY / range
      valueX = progress * after_x
      valueY = progress * after_y
    }

    if (nowY > range) {
      valueX = after_x
      valueY = after_y
    }

    $imgObj.css({'transform': `translate3d(${valueX}px, ${valueY}px, 0px)`})
  })
}
