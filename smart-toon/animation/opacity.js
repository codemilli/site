function addOpacityAnimation($block, $imgObj, animation, ratio) {
  const {start_at, end_at} = animation
  const top = Number(($imgObj.css('top') || '0px').replace('px', '') || 0)
  const idx = $block.data('idx')

  const onEvent = () => {
    const windowTop = $(document).scrollTop() + $(window).height()
    const offsetTop = $block.offset().top + top
    const startAt = offsetTop + (start_at * ratio)
    const endAt = offsetTop + (end_at * ratio)
    const range = endAt - startAt
    const nowY = windowTop - startAt

    let {before, after} = animation
    let opacity = before

    if (nowY >= 0 && nowY <= range) {
      const progress = nowY / range
      const diff = after - before
      opacity = opacity + (progress * diff)
    }

    if (nowY > range) {
      opacity = after
    }

    $imgObj.css({'opacity': opacity})
  }

  window.addEventListener('scroll', onEvent, {
    passive: true
  })
  $(document).ready(onEvent)
}
