function addOpacityAnimation($block, $imgObj, item, ratio) {
  const {animation, start_at, end_at} = item
  const top = Number(($imgObj.css('top') || '0px').replace('px', '') || 0)
  const idx = $block.data('idx')

  console.log('item top', item)

  const onEvent = () => {
    const windowTop = $(document).scrollTop() + $(window).height()
    const offsetTop = $block.offset().top + top
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
