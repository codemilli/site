function addCustomShakingAnimation($block, $imgObj, item, ratio) {
  const {animation, start_at, duration} = item
  const {range} = animation
  let animationing = false

  const onEvent = () => {
    const windowTop = $(document).scrollTop()
    const offsetTop = $block.offset().top
    const startAt = offsetTop + (start_at * ratio)
    const nowY = windowTop - startAt

    if (nowY > 0 && !animationing) {
      animationing = true
      let step = true
      const start = Date.now()
      const dur = duration * 1000

      !function shaking() {
        const now = Date.now()

        window.requestAnimationFrame(() => {
          const diff = now - start
          const progress = diff / dur

          step = !step

          if (step) {
            $imgObj.css({"transform": `translate3d(-${range}px, 0px, 0px)`})
          } else {
            $imgObj.css({"transform": `translate3d(${range}px, 0px, 0px)`})
          }

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

  $(window).on('scroll', onEvent)
  $(document).ready(onEvent)
}
