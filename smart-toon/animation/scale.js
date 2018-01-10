function addScaleAnimation($block, $imgObj, animation, ratio) {
  const {start_at, end_at} = animation
  const top = Number(($imgObj.css('top') || '0px').replace('px', '') || 0)

  const onEvent = () => {
    const windowTop = $(document).scrollTop() + $(window).height()
    const offsetTop = $block.offset().top + top
    const startAt = offsetTop + (start_at * ratio)
    const endAt = offsetTop + (end_at * ratio)
    const range = endAt - startAt
    const nowY = windowTop - startAt

    let {before, after} = animation
    let scale = before

    if (nowY >= 0 && nowY <= range) {
      const progress = nowY / range
      const diff = after - before
      scale = scale + (progress * diff)
    }

    if (nowY > range) {
      scale = after
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

  window.addEventListener('scroll', onEvent, {
    passive: true
  })
  $(document).ready(onEvent)
}
