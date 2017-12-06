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

    const preData = $imgObj.data('transform') || {}
    const postData = Object.assign(preData, {
      "scale": scale
    })

    $imgObj.data('transform', postData)
    const transform = $imgObj.data('transform')
    const {translate3d = {}} = transform
    const {x = 0, y = 0} = translate3d

    requestAnimationFrame(() => {
      $imgObj.css({'transform': `translate3d(${x}px, ${y}px, 0px) scale(${scale})`})
    })
  }

  $(window).on('scroll', onEvent)
  $(document).ready(onEvent)
}
