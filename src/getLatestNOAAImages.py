"""
Author: Neville Shane
Institution: LDEO, Columbia University
Email: nshane@ldeo.columbia.edu

Extract all the requestSourcePath URLs from the mapOverlays.json file, 
attempt to access them and write the returned Tile_Directory_URL to 
noaaSourcePaths.json file.
For use with NOAA layers that display most recent week/year, etc.

Usage:
python getLatestNOAAImages.py <root_dir>

Inputs:
    root_dir: the root directory where the mapOverlays.json file can be found,
              and where the output file, noaaSourcePaths.json, will be written 
"""

import requests
import json
import sys
import os
try:
    import boto3
except:
    print("ERROR: Unable to import boto3.")
    sys.exit(0)

root_dir = sys.argv[1]
json_file = os.path.join(root_dir, "mapOverlays.json")
out = {}
output_file = os.path.join(root_dir, "noaaSourcePaths.json")

S3_FILE_NAME = "js/noaaSourcePaths.json"
aws_settings = json.loads(open(os.path.join(root_dir, "aws_config.json"), 'r').read())

#read the the json file to find any Request Source Path urls
with open(json_file) as f:
    for line in f:
        if "requestSourcePath" in line:
            #extract the request source path from the line in the file
            url = line.split('":"')[1].replace('",', "").replace("http:", "https:").rstrip()
            #try and access the url
            r = requests.get(url)
            if r.status_code != 200:
                print("ERROR accessing url: %s" % url)
            else:
                #get the tile url from the json response
                tile_url = r.json()[0].get('Tile_Directory_URL')
                if tile_url is None:
                    print("ERROR: could not find Tile_Directory_URL in %s" % url)
                else:
                    #get the product name from the tile_url
                    product = tile_url.split('/')[6]
                    product_parts = product.split('.')
                    name = "%s.%s" % (product_parts[0], product_parts[1])
                    #add to the out dictionary
                    out[name] = tile_url

#write the out dictionary to a json file
try:
    with open(output_file, 'w') as outfile:
        json.dump(out, outfile, indent=4)
except:
    print("Error writing to output file: %s" % output_file)


# upload to AWS S3
try:
    s3 = boto3.client('s3',
                      aws_access_key_id=aws_settings['AWS_ACCESS_KEY_ID'],
                      aws_secret_access_key=aws_settings['AWS_SECRET_ACCESS_KEY']
                      )
    s3.upload_file(output_file, aws_settings['S3_BUCKET_NAME'], S3_FILE_NAME, ExtraArgs={'ACL': 'public-read'})
except:
    print("ERROR: unable to upload file %s to AWS S3" % S3_FILE_NAME)
    print(sys.exc_info()[1])
    sys.exit(0)


print("Done")
