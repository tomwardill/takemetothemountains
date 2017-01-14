# -*- coding: utf-8 -*-
import scrapy


class MountainsSpider(scrapy.Spider):
    name = 'mountains'
    start_urls = [
        'https://en.wikipedia.org/wiki/List_of_mountains_by_elevation'
    ]

    def parse(self, response):

        latitude = response.css('.latitude').xpath('text()').extract_first()
        longitude = response.css('.longitude').xpath('text()').extract_first()

        if latitude and longitude:
            text = response.css('#firstHeading').xpath('text()')
            title = text.extract_first()
            yield {
                'latitude': latitude,
                'longitude': longitude,
                'title': title,
                'url': response.url
            }

        links = response.xpath('//table//a[contains(@href, "/wiki/")]/@href').extract()
        for link in links:
            yield scrapy.Request(response.urljoin(link))
