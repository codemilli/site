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

  _.forEach(toon.blocks, (block) => {
    const hasBG = !!block.background.image_url
    const blockOption = {
      imageUrl: block.background.image_url,
      top: block.background.top * ratio,
      left: block.background.left * ratio,
      width: block.background.width * ratio,
      height: block.background.height * ratio
    }
    const $block = $(hasBG ? BlockTmpl(blockOption) : EmptyBlockTmpl(blockOption))

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
        if (animation.name === "@CUSTOM/Shaking") {
          addCustomShakingAnimation($block, $imgObj, item, ratio)
        }
      })
    })

    $viewer.append($block)
  })
}

