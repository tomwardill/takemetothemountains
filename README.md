# Take Me To The Mountains

I went looking for somewhere that would tell me where my nearest mountain is, as I live somewhere that it's not obvious. Couldn't find one, and worse, learnt that the definition of a mountain is somewhat nebulous.

Some looking at various sources later, I found a list of mountains on wikipedia. Judging that this seemed to be a reasonable thing, I set about making something out of it.

This project comes in two parts, the first is a scraper (`wiki`) that will scrape the list from wikipedia and produce an `items.json`. The second is the website that is currently hosted on [takemetothemountains.com](https://takemetothemountains.com)

## Scraper

Written using [scrapy](http://www.scrapy.org) and python3.

```bash
cd wiki
python3 -m venv .
bin/pip install scrapy
bin/scrapy crawl mountains
cd ..
cp wiki/items.json web
```

## Website

Uses the generated `items.json` to run a staticly hosted site. The browser location api is used to locate the user and mapbox for the maps. A search box is also provided.
