(function () {
 var ui = {
   PAGES: {
     COVERSTORY: {
     },
     STORY: {
     },
     VIEWER: {
       PREV: '이전',
       NEXT: '다음',
     },
     NOTICE: {
       TITLE: '공지사항',
     }
   },
   
   SIDEBAR: {
    NOTICE: '공지사항',
    QUICK_LINK_TITLE: 'NCSOFT 게임 커뮤니티',
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
