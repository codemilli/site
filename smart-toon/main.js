/**
 * 2017. 11. 23.
 */

const $viewer = $('.viewer')

onLoad()
  .then(() => $.get('/smart-toon/data/mock.json'))
  .then(calculateViewerSize)
  .then(onData)

function onLoad() {
  return new Promise((resolve) => $(window).load(resolve))
}

function calculateViewerSize(res) {
  const width = $viewer.width(),
        height = $viewer.height()

  return {
    viewer: {width, height},
    toon: res
  }
}

function onData({viewer, toon}) {
  const ratio = viewer.width / toon.width

  console.log('toon : ', toon)
  console.log('ratio : ', ratio)
  //$viewer.css({"height": `${toon.background.height * ratio}px`})
  // $viewer.find('#bg-image').attr('src', toon.background.image_url)

  _.forEach(toon.blocks, (block) => {
    const $block = $(BlockTmpl({
      imageUrl: block.background.image_url,
      top: block.background.top * ratio,
      left: block.background.left * ratio,
      width: block.background.width * ratio,
      height: block.background.height * ratio
    }))

    _.forEach(block.image_objects, (data) => {
      const $imgObj = $(ImageObjectTmpl({
        imageUrl: data.image_url,
        top: data.top * ratio,
        left: data.left * ratio,
        width: data.width * ratio,
        height: data.height * ratio,
        priority: data.priority
      }))

      $block.append($imgObj)

      _.forEach(data.animation_list, (item) => {
        const {animation} = item
        if (animation.name === "translate") {
          addTransitionAnimation($block, $imgObj, item, ratio)
        }
      })
    })

    console.log('block', $block)
    $viewer.append($block)
  })
}


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



