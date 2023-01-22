const got = require('@/utils/got');
const cheerio = require('cheerio');
const { parseRelativeDate } = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const url = 'https://sec.today/pulses/';
    const response = await got.get(String(url));
    const $ = cheerio.load(response.data);
    const list = $("[class='card my-2']").get();
    const items = list.map((i) => {
        const item = $(i);
        const title = item.find('q').text();
        const pla = item.find('a').text();
        let inc_str = item.find('span.text-muted').text();
        // remove '• '
        inc_str = inc_str.split("• ")[1];
        const date = parseRelativeDate(inc_str);
        const href = item.find('a').attr('href');
        return {
            title: `${title} ${pla !== '未知' ? pla : ''}`,
            pubDate: date,
            link: `${url}${href}`,
            description: pla,
        };
    });

    ctx.state.data = {
        title: 'sec-news',
        link: 'https://sec.today/pulses/',
        item: items,
    };
};
