(function () {
 var ui = {
   PAGES: {
     COVERSTORY: {
     },
     STORY: {
     },
     VIEWER: {
     },
   },

   GENERAL: {
     MORE: '더보기',
   },
 }

 if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
   module.exports = ui
 } else {
   window.__UI__ = ui
 }
})()
