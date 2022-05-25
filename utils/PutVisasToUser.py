import sys
import requests
import pprint

ALL_VISAS = [
    {
        "id": "670cc2e7-9a9c-4273-9334-beb40d364e5c",
        "visaIssuer": "https://datasets.starterkit.ga4gh.org/",
        "visaName": "StarterKitDatasetsControlledAccessGrants",
        "visaDescription": "Controlled access dev datasets for the GA4GH Starter Kit"
    },
    {
        "id": "39e6e359-e8da-4193-92cc-2eed421fe729",
        "visaIssuer": "https://datasets.starterkit.ga4gh.org/",
        "visaName": "DatasetAlpha",
        "visaDescription": "First simulated dataset controlled by GA4GH"
    },
    {
        "id": "51db203b-ed6e-4de8-b196-011cae5cea15",
        "visaIssuer": "https://datasets.starterkit.ga4gh.org/",
        "visaName": "DatasetBeta",
        "visaDescription": "Second simulated dataset controlled by GA4GH"
    },
    {
        "id": "4ed80481-dd73-4984-bee5-8e811a330102",
        "visaIssuer": "https://datasets.starterkit.ga4gh.org/",
        "visaName": "DatasetGamma",
        "visaDescription": "Third simulated dataset controlled by GA4GH"
    }
]

## GET USER ID ##
userId = ""

if len(sys.argv) <= 2: # there is no entry
    print("Please enter a user ID after a space, and then the ID of the visas you would like to assert")
    quit()

userId = sys.argv[1]

## ## ## ##

## GET VISAS ##
VISAS_TO_ASSERT = []

for i in range(2, len(sys.argv)):
    ## Find the visa
    visa = {}
    for v in ALL_VISAS:
        if v["id"] == sys.argv[i]:
            visa = v
    if visa == {}:
        print("Visa by the id " + sys.argv[i] + " not found! Exiting.")
        quit()
    finalObj = { "status": "active", "passportVisa": visa}
    VISAS_TO_ASSERT.append(finalObj)

## ## ## ##

## SENDING THE PUT REQUEST ##

URL = "http://localhost:4501/admin/ga4gh/passport/v1/users/" + userId

HEADERS = {"Content-Type": "application/json"}

# Python uses single quotes ' for strings, replacing all for " suitable with raw JSON
VISAS_TO_ASSERT_STR = "%s" % (VISAS_TO_ASSERT)
VISAS_TO_ASSERT_STR = VISAS_TO_ASSERT_STR.replace("'",'"')

BODY = "{\"id\":\"%s\",\"passportVisaAssertions\":%s}" % (userId, VISAS_TO_ASSERT_STR)

# Sending the request
r = requests.put(url = URL, headers=HEADERS, data=BODY)
data = r.json()

# Print what we get back
pprint.pprint(data)
