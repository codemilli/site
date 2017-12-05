function addOpacityAnimation($block, $imgObj, item, ratio) {
  const {animation, start_at, end_at} = item
  const idx = $block.data('idx')

  const onEvent = () => {
    const windowTop = $(document).scrollTop()
    const offsetTop = $block.offset().top
    const startAt = offsetTop + (start_at * ratio)
    const endAt = offsetTop + (end_at * ratio)
    const range = endAt - startAt
    const nowY = windowTop - startAt

    let {before_opacity, after_opacity} = animation
    let opacity = before_opacity

    if (nowY >= 0 && nowY <= range) {
      const progress = nowY / range
      const diff = after_opacity - before_opacity
      opacity = opacity + (progress * diff)
    }

    if (nowY > range) {
      opacity = after_opacity
    }

    $imgObj.css({'opacity': opacity})
  }

  $(window).on('scroll', onEvent)
  $(document).ready(onEvent)
}
