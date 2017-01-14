# -*- coding: utf-8 -*-


class WikimountainsPipeline(object):
    """
    Convert the scraped text to decimal lat/lng for later use
    """

    @staticmethod
    def dms2dd(original):
        """
        Convert the long form lat/long to decimal
        """

        split = original.split(' ')
        if len(split) == 2:
            degrees = split[0]
            minutes = '0'
            seconds = '0'
            direction = split[1]
        elif len(split) == 3:
            degrees = split[0]
            minutes = split[1]
            seconds = '0'
            direction = split[2]
        elif len(split) == 4:
            degrees = split[0]
            minutes = split[1]
            seconds = split[2]
            direction = split[3]

        dec = float(degrees) + float(minutes) / 60 + float(seconds) / (60 * 60)
        if direction == 'W' or direction == 'S':
            dec *= -1
        return dec

    def process_item(self, item, _):
        """
        Process the item, stripping unicode chars and converting
        """

        # Slightly horrible replace chain to something we can split
        # more easily
        lat = item['latitude'].replace('\xb0', ' ').replace('\u2032', ' ').replace('\u2033', ' ')
        lon = item['longitude'].replace('\xb0', ' ').replace('\u2032', ' ').replace('\u2033', ' ')

        decimal_lat = self.dms2dd(lat)
        decimal_lon = self.dms2dd(lon)

        item['decimal_latitude'] = decimal_lat
        item['decimal_longitude'] = decimal_lon

        return item
