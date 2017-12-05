/**
 * 2017. 11. 23.
 */

const qs = {};
const queries = location.search.substring(1).split('&') || [];

for(let i = 0; i < queries.length; i++) {
  if (queries[i]) {
    const pair = queries[i].split('=');
    qs[pair[0]] = pair[1];
  }
}

const $viewer = $('.viewer')
const {resource} = qs
const dataUrl = `/smart-toon/data/${resource || 'mock'}.json`

onLoad()
  .then(() => $.get(dataUrl))
  .then(calculateViewerSize)
  .then(onData)
  .then(playBGM)

function onLoad() {
  return new Promise((resolve) => $(window).load(resolve))
}

function calculateViewerSize(res) {
  const width = $viewer.width(),
        height = $viewer.height()

  document.documentElement.style.background = res.background_color || "white"

  return {
    viewer: {width, height},
    toon: res
  }
}

function onData({viewer, toon}) {
  const ratio = viewer.width / toon.width

  console.log('toon : ', toon)
  console.log('ratio : ', ratio)

  _.forEach(toon.blocks, (block, idx) => {
    const hasBG = !!block.background.image_url
    const blockOption = {
      bgColor: toon.background_color,
      imageUrl: block.background.image_url,
      top: block.background.top * ratio,
      left: block.background.left * ratio,
      width: block.background.width * ratio,
      height: block.background.height * ratio,
      idx: idx
    }
    const $block = $(hasBG ? BlockTmpl(blockOption) : EmptyBlockTmpl(blockOption))

    $viewer.append($block)

    _.forEach(block.background.animation_list, (item) => {
      const {animation} = item
      if (animation.name === "translate") {
        addTransitionAnimation($block, $block, item, ratio)
      }
      if (animation.name === "opacity") {
        addOpacityAnimation($block, $block, item, ratio)
      }
      if (animation.name === "scale") {
        addScaleAnimation($block, $block, item, ratio)
      }
      if (animation.name === "@CUSTOM/Shaking") {
        addCustomShakingAnimation($block, $block, item, ratio)
      }
    })

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
        if (animation.name === "scale") {
          addScaleAnimation($block, $imgObj, item, ratio)
        }
        if (animation.name === "@CUSTOM/Shaking") {
          addCustomShakingAnimation($block, $imgObj, item, ratio)
        }
      })

      _.forEach(data.audio_objects, (audio) => {
        audio.play_at
      })
    })
  })
}

function playBGM() {
  return new Promise((resolve) => {
    const audio = document.getElementById('bgm')
    audio.play()
    resolve()

    audio.addEventListener('ended', () => {
      audio.currentTime = 0
      audio.play()
    }, false)
  })
}

