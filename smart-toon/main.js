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
  const ratio = viewer.width / toon.background.width

  console.log('toon : ', toon)
  console.log('ratio : ', ratio)
  $viewer.css({"height": `${toon.background.height * ratio}px`})
  $viewer.find('#bg-image').attr('src', toon.background.image_url)

  _.map(toon.image_objects, (data, i) => {
    const imgObj = ImageObjectTmpl({
      imageUrl: data.image_url,
      priority: data.priority
    })

    console.log('imgObj', imgObj)

    $viewer.append(imgObj)
  })
}




