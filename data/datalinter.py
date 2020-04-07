from pprint import pprint
from jsonmerge import merge 
import json
import glob

f2 = open('./data/geo_2000.geojson')
y2 = json.load(f2)

f2.close()

f1 = open('./data/geo_2001.geojson')
y1 = json.load(f1)

f1.close()

print(glob.glob('./data/geo_*.geojson'))

#result = merge(y1,y2)

result = {}
result['2001'] = y1 
result['2000'] = y2

with open('./data/mdata.json','w') as ff:
    json.dump(result,ff);
