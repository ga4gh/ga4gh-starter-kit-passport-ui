# ga4gh-starter-kit-passport-ui
Central UI server connecting to other Passport-related microservices (ory hydra, ory kratos)

## Preparations Needed to Run the Passport Service
This service is a docker container, having [Docker Desktop](https://docs.docker.com/desktop/) installed beforehand will be useful. This repo also uses a [Makefile](./Makefile), which allows defining special shell commands. If you would like to see what does the make commands do in more detail, please visit the file.

***
###### Building the Docker Image
First build the `docker image` with the contents of this repo:
```
make docker-build
```
Confirm the `docker image` is present by running;
```
docker images
```
You should see an image for the repository `ga4gh/ga4gh-starter-kit-passport-ui-node`

***
###### Running the Docker Compose
The GA4GH Passports: [Starterkit]("https://starterkit.ga4gh.org/") Implementation is made up of multiple services, this UI-node being one of them. In order to start running multiple services at once a [docker compose](./passport-develop.yml) file used.

Spin up the docker compose file by running:
```
make passport-network
```
Note: If you would like to modify the ui-node locally, you can also run two commands in two separate terminal tabs...
For the UI-node:
```
make passport-develop-1
```
For all other services:
```
make passport-develop-2
```

***
###### Confirm Docker Compose is Working
First wait for all the downloading that is needed for the other docker images. You will know the services have succesfully started if the
migration services succesfully exit.

You can confirm this by confirming the lines (not necessarily one after the other)
```
ga4gh-starter-kit-passport-ui_kratos-migrate_1 exited with code 0
ga4gh-starter-kit-passport-ui_hydra-migrate_1 exited with code 0
```
You can also confirm by opening the currently active docker compose in the Docker Desktop app, you should see the two migration services
grayed out. The services are named `ga4gh-starter-kit-passport-ui_kratos-migrate_1` and `ga4gh-starter-kit-passport-ui_hydra-migrate_1`.

***
## Important Note Regarding Shutting Down the Docker Compose
If you shut down the `passport-network`, or restart it for any reason. You should also run the command below to fully clear the docker images. Otherwise there might be issues upon restarting:
```
make docker-down
```

***
## 0. Sending API Requests
In the rest of this document, you will need to send some API requests to the Passport Broker service, both for testing and using purposes. You
can send requests either via your favorite API platform (such as [Postman](https://www.postman.com/)), or via the [python scripts](./utils) present in this document.

If you are going to be sending the requests via the python scripts, you should confirm you have the correct python modules installed:

*Note: You should replace `python` with `python3`, and `pip` with `pip3` if you are using Python 3 for the commands below.*
1. Confirm python is installed by running:
    - If not installed, visit [python.org](https://www.python.org/downloads/) to download and install it.
```
python --version
```
2. The `pip` module should come pre-installed, you can check by running the command:
    - If `pip` is not available, visit the [pip documentation website](https://pip.pypa.io/en/stable/installation/) to set it up.
```
pip --version
```
3. Download the required python modules by running the command:
```
pip install -r requirements.txt
```

***
## 1. The Passport Broker
One crucial service is the passport broker, which is a docker container as well. It is named `ga4gh-starter-kit-passport-ui_passport-broker_1` in the docker compose. We can interact with the service by sending it various different API requests.

Confirm the service is working:

###### Python
Run the command:
```
python utils/GetServiceInfo.py
```
###### API Platform
Send a GET request to the `http://localhost:4500/ga4gh/passport/v1/service-info` endpoint.

###### Response
You should get back an object body starting with `id` with value `"org.ga4gh.starterkit.passport.broker"`, and other information.

***
## 2. See all Users in the Passport Broker
Go to http://127.0.0.1:4455/welcome to enter the welcome page.

Towards the bottom, under Account Management press [Sign Up](http://127.0.0.1:4455/registration) to create an account.

After signing up, you should see your account information on the welcome page, under User Information.

Once the sign up is complete, a user in the passport broker service will also be created. Confirm the new user is created:

###### Python
Run the command:
```
python utils/GetAllUsers.py
```
There are some example users, but you should see your account's ID in the list of users that is returned (the same ID seen on under User Information).

###### API Platform
Send a GET request to the `http://localhost:4501/admin/ga4gh/passport/v1/users` endpoint. 

###### Response
You should see an array of user IDs where one of the IDs will match the ID you see on the [welcome](http://127.0.0.1:4455/welcome) page.

***
## 3. Check the Visas of a User

Check what visas a user has asserted: 

###### Python
Run the command:
```
python utils/GetUserVisas.py \
<USER_ID>
```
###### API Platform
Send a GET request to the endpoint:
```
http://localhost:4501/admin/ga4gh/passport/v1/users/<USER_ID>
```
*Make sure to change `<USER_ID>` to a valid user ID.*

###### Response
You should get back a JSON object with the visas present on the user.

***
## 4. See All Available Visas

You can see all available visas in the Passport Broker:

###### Python
Run the command:
```
python utils/GetAllVisas.py
```
###### API Platform
Send a GET request to the endpoint:
```
http://localhost:4501/admin/ga4gh/passport/v1/visas
```

###### Response
You should get back a JSON object with all available visas in the Passport Broker service.

***
## 5. Assigning New Visas to a User

Note the ID of the visas you would like to add, see the previous step to GET all available visas.

###### Python
You should have atleast one visa ID to enter, but you can assert more than one at once. Run the command:
```
python3 utils/PutVisasToUser.py \
<USER_ID> \
<VISA_ID_1> \
<VISA_ID_2>
```
###### API Platform
You can assign new visas to a user by sending a PUT request to the same endpoint:
```
http://localhost:4501/admin/ga4gh/passport/v1/users/<USER_ID>
```
In this PUT request, you need to include...

In headers, include a key `Content-Type` with value `application/json`. 
In the body include a JSON object with two keys, first the `"id"` which should be the users ID as a string, and `"passportVisaAssertions"` which will be an array of visas. See an example body below:
```
{
    "id": "<USER_ID>",
    "passportVisaAssertions": [
        {
            "status": "active",
            "passportVisa": {
                "id": "670cc2e7-9a9c-4273-9334-beb40d364e5c",
                "visaName": "StarterKitDatasetsControlledAccessGrants",
                "visaIssuer": "https://datasets.starterkit.ga4gh.org/",
                "visaDescription": "Controlled access dev datasets for the GA4GH Starter Kit"
            }
        },
        {
            "status": "active",
            "passportVisa": {
                "id": "39e6e359-e8da-4193-92cc-2eed421fe729",
                "visaName": "DatasetAlpha",
                "visaIssuer": "https://datasets.starterkit.ga4gh.org/",
                "visaDescription": "First simulated dataset controlled by GA4GH"
            }
        }
    ]
}
```
*Make sure to change `<USER_ID>` and `<VISA_ID_#>` to a valid values.

###### Response
Upon a succesful PUT request, you should get back to body object you have sent.

***
## 6. Getting a Passport JWT (Json Web Token)

Back in the [welcome page](http://127.0.0.1:4455/welcome) press [Get Passport Token](http://127.0.0.1:4455/passport). On this page you should see your assigned visas, if no visas are assigned please look at the previous step. Select some visas, and then press Get Passport Token.

You can confirm the validity of your JWT token by visiting https://jwt.io/ and pasting the JWT token to examine its contents.