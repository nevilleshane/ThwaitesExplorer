"""
Author: Neville Shane
Institution: LDEO, Columbia University
Email: nshane@ldeo.columbia.edu

TBD

Usage:
python getSeaLevelTrendsTable.py 
upload output file to S3 bucket www.earth-observer.org/data/basemaps/tables/global/TideStations

Inputs:

"""

import requests
import re

output_file = "TideStationRecords2020.txt"

global_url = 'https://tidesandcurrents.noaa.gov/sltrends/data/GlobalStationsLinearSeaLevelTrends.txt'
us_url = 'https://tidesandcurrents.noaa.gov/sltrends/data/USStationsLinearSeaLevelTrends.txt'
link_url = 'https://tidesandcurrents.noaa.gov/sltrends/sltrends_station.shtml?id='

color_lut = {
    '117|117|117':{'min':15, 'max':21},
    '0|118|25':{'min':12, 'max':15},
    '255|0|17':{'min':9, 'max':12},
    '255|115|31':{'min':6, 'max':9},
    '255|255|58':{'min':3, 'max':6},
    '0|255|55':{'min':0, 'max':3},
    '0|0|250':{'min':-3, 'max':0},
    '0|255|255':{'min':-6, 'max':-3},
    '255|0|250':{'min':-9, 'max':-6},
    '103|0|214':{'min':-12, 'max':-9},
    '0|0|0':{'min':-15, 'max':-12},
    '117|117|26':{'min':-18, 'max':-15}
}

def readFromNOAA(noaa_url):
    out_text = ''
    # get the Sea Level Trends table from the NOAA site
    r = requests.get(noaa_url)
    if r.status_code != 200:
        print("ERROR accessing url: %s" % url)
    else:
        # convert it to dictionary/json object
        table_txt = r.text.split('\n')
        col_names = re.sub('  +', '\t', table_txt[0]).split('\t') 
        for row in table_txt[1:]:
            if row == '': continue
            row_split = re.sub('  +', '\t', row).split('\t')
            row_dict = dict(zip(col_names,row_split))
    
            # calculate symbol colors using lookup table
            for col in color_lut.keys():
                if float(row_dict['Trends (mm/yr)']) >= color_lut[col]['min'] and float(row_dict['Trends (mm/yr)']) < color_lut[col]['max']:
                    row_dict['color'] = col
            if not row_dict.get('color'):
                print("No color found for %s (%s)" %(row_dict['Station Name'], row_dict['Trends (mm/yr)']))

            # work out which image to use (arrow up or arrow down)
            if float(row_dict['Trends (mm/yr)']) >= 0:
                row_dict['image'] = 'sltbackgroundup.png'
            else:
                row_dict['image'] = 'sltbackgrounddown.png'

            # reformat
            out_text += '%s\t%s\t%s\t%s\t%s+/-%s\t%s+/-%s\t%s\t%s-%s\t%s%s\t%s\n' % (
                    row_dict['Station Name'].replace(',','|'),
                    row_dict['Longitude'],
                    row_dict['Latitude'],
                    row_dict['Trends (mm/yr)'],
                    row_dict['Trends (mm/yr)'], row_dict['+/- 95% Cl (mm/yr)'],
                    row_dict['Trends (ft/cent.)'], row_dict['+/- 95% Cl (ft/cent.)'],
                    row_dict['color'],
                    row_dict['First Year'], row_dict['Last Year'],
                    link_url, row_dict['Station ID'],
                    row_dict['image']
                )
    return out_text


out_text = 'Tide Station\tLongitude\tLatitude\tSea level change (mm/year)\tSea level change\tSea level change\tSymbol Color (rgb)\tMeasurement period\tLink	Image\n'
out_text += readFromNOAA(global_url)
out_text += readFromNOAA(us_url)

# save
try:
    with open(output_file, 'w') as outfile:
        outfile.write(out_text)
except:
    print("Error writing to output file: %s" % output_file)


  
