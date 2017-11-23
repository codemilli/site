/**
 * 2017. 11. 23.
 */

$.get('/smart-toon/data/mock.json')
 .then(calculateViewerSize)
 .then(onData)

function calculateViewerSize(res) {
  const viewer = $('.viewer'),
      width = viewer.width(),
      height = viewer.height()

  return {
    viewer: {width, height},
    toon: res
  }
}

function onData({viewer, toon}) {
  const ratio = viewer.width / toon.background.width
}




