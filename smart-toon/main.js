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

  console.log('hi')

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
        if (animation.name === "opacity") {
          addOpacityAnimation($block, $imgObj, item, ratio)
        }
      })
    })

    $viewer.append($block)
  })
}

