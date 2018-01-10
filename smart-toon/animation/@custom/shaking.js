function addCustomShakingAnimation($block, $imgObj, animation, ratio) {
  const {start_at, end_at, duration} = animation
  const {rangeX, rangeY} = animation
  const top = Number(($imgObj.css('top') || '0px').replace('px', '') || 0)
  let animationing = false

  const onEvent = () => {
    const windowTop = $(document).scrollTop() + $(window).height()
    const offsetTop = $block.offset().top + top
    const startAt = offsetTop + (start_at * ratio)
    const nowY = windowTop - startAt

    if (nowY > 0 && !animationing) {
      animationing = true
      let step = true
      let frames = 0
      const start = Date.now()
      const dur = duration

      !function shaking() {
        frames++
        const now = Date.now()

        if (frames % 2 !== 0) {
          return window.requestAnimationFrame(shaking)
        }

        window.requestAnimationFrame(() => {
          const diff = now - start
          const progress = diff / dur
          step = !step

          const preData = $imgObj.data('transform') || {}
          const postData = Object.assign(preData, {
            "translate3d": {
              x: step ? rangeX : -rangeX,
              y: step ? rangeY : -rangeY,
              z: 0
            }
          })
          $imgObj.data('transform', postData)
          const transform = $imgObj.data('transform')
          const {translate3d = {}, scale = 1} = transform
          const {x = 0, y = 0} = translate3d

          $imgObj.css({'transform': `translate3d(${x}px, ${y}px, 0px) scale(${scale})`})

          if (progress >= 1) {
            return
          }
          shaking()
        })
      }()

      $imgObj.addClass("custom-animation-shaking")
    } else if (nowY < 0) {
      animationing = false
      $imgObj.removeClass("custom-animation-shaking")
    }
  }

  window.addEventListener('scroll', onEvent, {
    passive: true
  })
  $(document).ready(onEvent)
}
