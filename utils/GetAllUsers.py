import sys
import requests
import pprint

URL = "http://localhost:4501/admin/ga4gh/passport/v1/users"
PARAMS = {}
r = requests.get(url = URL, params = PARAMS)
data = r.json()

pprint.pprint(data)