import sys
import requests
import pprint

userId = ""

if len(sys.argv) == 1: # there is no entry
    print("Please enter a user ID after a space")
    quit()

userId = sys.argv[1]

URL = "http://localhost:4501/admin/ga4gh/passport/v1/users/" + userId
PARAMS = {}
r = requests.get(url = URL, params = PARAMS)
data = r.json()

if "passportVisaAssertions" in data:
    pprint.pprint(data["passportVisaAssertions"])
else:
    print("User has no visas.")

