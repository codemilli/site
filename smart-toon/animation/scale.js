function addScaleAnimation($block, $imgObj, item, ratio) {
  const {animation, start_at, end_at} = item
  const onEvent = () => {
    const windowTop = $(document).scrollTop()
    const offsetTop = $block.offset().top
    const startAt = offsetTop + (start_at * ratio)
    const endAt = offsetTop + (end_at * ratio)

    const range = endAt - startAt
    const nowY = windowTop - startAt

    let {before_scale, after_scale} = animation
    let scale = before_scale

    if (nowY >= 0 && nowY <= range) {
      const progress = nowY / range
      const diff = after_scale - before_scale
      scale = scale + (progress * diff)
    }

    if (nowY > range) {
      scale = after_scale
    }

    $imgObj.css({'transform': `scale(${scale})`})
  }

  $(window).on('scroll', onEvent)
  $(document).ready(onEvent)
}
