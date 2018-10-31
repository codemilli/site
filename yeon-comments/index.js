const fs = require('fs');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const commentPageUrl = 'https://comic.naver.com/comment/comment.nhn?titleId=713872&no=12';
const startTs = Date.now();
let totalCommentList = [];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(commentPageUrl, {waitUntil: 'networkidle2'});
  await timer(200);
  await clickAllComments(page);

  async function iterate() {
    const html = await page.content();
    const data = await eval(html);
    totalCommentList = totalCommentList.concat(data.comments);

    if (data.isLast) {
      return;
    } else {
      await clickNextBtn(page);
      await iterate();
    }
  }

  await iterate();

  console.log('Duration : ', Date.now() - startTs, 'ms');
  console.log('Total comments count: ', totalCommentList.length);

  fs.writeFileSync('comments.json', JSON.stringify(totalCommentList), 'utf8');

  await browser.close();
})();

async function eval(html) {
  const $ = cheerio.load(html);
  const lastBtn = $('a.u_cbox_next.u_cbox_next_end');
  const isLast = lastBtn.length === 0;
  return {
    comments: getCommentContent($) || [],
    isLast,
  };
}

function getCommentContent($) {
  const contentsWrap = $('.u_cbox_list');
  const pageNum = $('strong.u_cbox_page .u_cbox_num_page').text();
  const contents = contentsWrap.find('li.u_cbox_comment');
  const commentList = [];
  contents.each((i) => {
    let text, like, dislike;
    const content = contents.eq(i);
    const txtWrap = content.find('span.u_cbox_contents');
    const toolWrap = content.find('div.u_cbox_tool');
    text = txtWrap.text();
    like = parseInt(toolWrap.find('.u_cbox_btn_recomm .u_cbox_cnt_recomm').text().trim());
    dislike = parseInt(toolWrap.find('.u_cbox_btn_unrecomm .u_cbox_cnt_unrecomm').text().trim());
    console.log(`${pageNum} : `, text);
    commentList.push({text, like, dislike});
  });
  return commentList;
}

async function clickAllComments(page) {
  await page.evaluate(() => {
    document.querySelector('li.u_cbox_sort_option_wrap:nth-child(2) a').click();
  });
  await timer(100);
}

async function clickNextBtn(page) {
  await page.evaluate(() => {
    const present = document.querySelector('strong.u_cbox_page');
    const next = present.nextElementSibling;
    next.click();
  });
  await timer(100);
}

async function clickLastBtn(page) {
  await page.evaluate(() => {
    document.querySelector('a.u_cbox_next.u_cbox_next_end').click();
  });
  await timer(100);
}

async function timer(duration = 200) {
  return await new Promise(resolve => setTimeout(resolve, duration));
}
