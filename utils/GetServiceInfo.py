import sys
import requests
import pprint

URL = "http://localhost:4500/ga4gh/passport/v1/service-info"
PARAMS = {}
r = requests.get(url = URL, params = PARAMS)
data = r.json()

pprint.pprint(data)