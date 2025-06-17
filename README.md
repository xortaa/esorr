E-SORR web app environment variables 


MONGODB_URI

Create a mongodb database in http://mongodb.com/ or host a local one.


GCP_PROJECT_ID

Create a project in the google cloud platform and use the id of that created project



 GCP_CLIENT_EMAIL

under the Service Accounts tab. create a service account 
the client email would be the generated email of the service account. 
give the service account the admin permission


GCP_CLIENT_ID

get the unique id of the service account 




GCP_PRIVATE_KEY
GOOGLE_APPLICATION_CREDENTIALS="config\key-file.json"

under the service accounts tab, go to Keys and create a new key.
choose json. 
the saved json should be renamed to key-file.json and placed under /config of the web app file directory
inside the json there is an object called private key, copy and paste the whole key into the GCP_PRIVATE_KEY of the .env.local






GCP_BUCKET_NAME
GCP_BUCKET_SIGNATURES

Create a google cloud bucket and the name of the google cloud bucket should be added into the GCP_BUCKET_NAME & GCP_BUCKET_SIGNATURES



OSA_EMAIL

email of the osa account that you want to be admin. could be your email for local testing any email under this would be granted the admin role.

NEXTAUTH_SECRET

any 

GOOGLE_CLIENT_SECRET
GOOGLE_CLIENT_ID

in google cloud platform under credentials tab, create a new OAUTH client ID, the secret and the id generated should be placed here in the .env.local



