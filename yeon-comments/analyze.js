$.get('db/comments2.json').then((comments) => {
  /**
   const wordDiction = {};
   const totalStr = comments.reduce((acc, c) => acc + c.text + ' ', '');
   const matched = totalStr.match(/[^\u0000-\u007F]+/g);

   matched.forEach((word) => {
     if (wordDiction[word] >= 0) {
       wordDiction[word] += 1;
     } else {
       wordDiction[word] = 0;
     }
   });
   const ordered = Object.keys(wordDiction)
   .map((key) => ({
      word: key,
      cnt: wordDiction[key],
    }))
   .sort((a, b) => b.cnt - a.cnt);
   */

  const cntMap = {
    '진짜': 0,
    '너무': 0,
    '정말': 0,
    '와': 0,
    '대박': 0,
    '쩔어': 0,
    '쩐다': 0,
    '감사합니다': 0,
    '편지': 0,
    '우와': 0,
    'ㅠㅠ': 0,
    '미쳤다': 0,
    '퀄리티': 0,
    '플레이툰': 0,
    '소리': 0,
    '좋아': 0,
    '작가님': 0,
  };
  const cntMapKeyRegs = Object.keys(cntMap).map(key => ({reg: new RegExp(key, 'g'), key}));
  const $rtCmtWrap = $('.rt-comment__wrap');
  const $wordCloudWrap = $('.word-cloud__wrap');
  (function iterate(i) {
    if (i >= comments.length) {
      return;
    }
    const comment = comments[i];
    const isBest = comment.like > 5;

    if (i % 100 === 0 && i > 100) {
      $rtCmtWrap.find('.rt-comment__item:lt(100)').remove();
    }
    cntMapKeyRegs.forEach((data) => {
      comment.text = comment.text.replace(data.reg, `<span>${data.key}</span>`);
    });
    $rtCmtWrap.append(
      $(`<p class="rt-comment__item rt-comment__item--${
        isBest ? 'best' : ''}">${comment.text}</p>`),
    );
    $wordCloudWrap.scrollTop($wordCloudWrap.prop('scrollHeight'));
    setTimeout(() => iterate(i + 1), 40);
  })(0);
});
