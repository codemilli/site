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
const {resource, toon, cid, token} = qs
let dataUrl
let authToken

if (toon) {
  const isDev = location.origin.indexOf('cxteam.cool') !== -1
  const session = cid || (isDev ? '4CB1A7C514EA215FA0A28D1C25E9D831' : 'FD39693EF8DA2A7A5D7DD1077325FCE1')
  authToken = token || (isDev ? 'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlX2NkIjoiREVWSUNFIiwiZXhwaXJlX2RhdGUiOjE1MTUwMzk5MjQwNzksImFwcF9ubyI6MTAwMSwiaWQiOiI0Q0IxQTdDNTE0RUEyMTVGQTBBMjhEMUMyNUU5RDgzMSIsInRva2VuIjoiTWlKUFJtcHRQMHh3UGlsTld5ODBPRjRsWW0wdllnPT0ifQ.iDkrh_IST4B-V1YglnzF71v9NHSdetkXlwZkheLiLOk'
    : 'eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlX2NkIjoiREVWSUNFIiwiZXhwaXJlX2RhdGUiOjE1MTUwMzk4MjU5ODgsImFwcF9ubyI6MTAwMSwiaWQiOiJGRDM5NjkzRUY4REEyQTdBNUQ3REQxMDc3MzI1RkNFMSIsInRva2VuIjoiTUdRclNDMTJXM2h5SzB4ZlVGWkRabHhoTm54Rkp3PT0ifQ.0pM46wgnOnq9lYn-9WCthRV5im_xHH8slxqtDayNerY')

  dataUrl = isDev ? `http://api.cxteam.cool/v5.2/ko/toon/10061/series/10087/content/all?cid=${session}`
    : `https://api-rc.nc-comix.com/v5.2/ko/toon/10045/series/10259/content/all?cid=${session}`
} else {
  dataUrl = `${RESOURCE_PATH}/smart-toon/data/${resource || 'mock'}.json`
}

onLoad()
  .then(() => {
    if (resource === 'latest') {
      return JSON.parse(localStorage.getItem('latest'))
    } else {
      return $.ajax(dataUrl, {
        crossDomain: true,
        headers: {
          Authorization: `bearer ${authToken}`
        },
        xhrFields: {
          withCredentials: true
        }
      })
    }
  })
  .then(calculateViewerSize)
  .then(onData)
  .then(playBGM)

function onLoad() {
  return new Promise((resolve) => $(window).load(resolve))
}

function calculateViewerSize(res) {
  if (res.result === '504') {
    return alert('Please Login First')
  }
  if (toon) {
    res = res.value
  }

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
      priority: block.background.priority,
      idx: idx
    }
    const $block = $(hasBG ? BlockTmpl(blockOption) : EmptyBlockTmpl(blockOption))

    $viewer.append($block)
    const $wrapper = $block.find('.wrapper')

    _.forEach(block.background.animation_list, (item) => {
      const {animation} = item
      if (animation.name === "translate") {
        addTransitionAnimation($block, $wrapper, item, ratio)
      }
      if (animation.name === "opacity") {
        addOpacityAnimation($block, $wrapper, item, ratio)
      }
      if (animation.name === "scale") {
        addScaleAnimation($block, $wrapper, item, ratio)
      }
      if (animation.name === "@CUSTOM/Shaking") {
        addCustomShakingAnimation($block, $wrapper, item, ratio)
      }
    })

    $wrapper.append($(ImageObjectTmpl({
      imageUrl: block.background.image_url,
      top: 0,
      left: 0,
      width: block.background.width * ratio,
      height: block.background.height * ratio,
      priority: block.background.priority,
    })))

    _.forEach(block.image_objects, (data) => {
      const $imgObj = $(ImageObjectTmpl({
        imageUrl: data.image_url,
        top: data.top * ratio,
        left: data.left * ratio,
        width: data.width * ratio,
        height: data.height * ratio,
        priority: data.priority
      }))

      $wrapper.append($imgObj)

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

