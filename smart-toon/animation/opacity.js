function addOpacityAnimation($block, $imgObj, item, ratio) {
  const {animation, start_at, end_at} = item

  $(window).on('scroll', () => {
    const windowTop = $(document).scrollTop()
    const offsetTop = $block.offset().top
    const startAt = offsetTop + (start_at * ratio)
    const endAt = offsetTop + (end_at * ratio)

    const range = endAt - startAt
    const nowY = windowTop - startAt

    let {before_opacity, after_opacity} = animation
    let opacity = null

    if (nowY < 0) {
      opacity = before_opacity
    }

    if (nowY >= 0 && nowY <= range) {
      const progress = nowY / range
      opacity = progress * after_opacity
    }

    if (nowY > range) {
      opacity = after_opacity
    }

    $imgObj.css({'opacity': opacity})
  })
}
