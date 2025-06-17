# E-SORR web app environment variables 


## MONGODB_URI

Create a mongodb database in http://mongodb.com/ or host a local one.


## GCP_PROJECT_ID

Create a project in the google cloud platform and use the id of that created project

![image](https://github.com/user-attachments/assets/a3b8d5d4-82f4-401d-9b2f-5722189f5db0)


## GCP_CLIENT_EMAIL

under the Service Accounts tab. create a service account 
the client email would be the generated email of the service account. 
give the service account the admin permission

![image](https://github.com/user-attachments/assets/a1d1af8c-c287-44cc-806b-663c8369c617)


## GCP_CLIENT_ID

get the unique id of the service account 

![image](https://github.com/user-attachments/assets/3f6ae6ac-6e4a-4357-981b-dc8ff09e099c)



## GCP_PRIVATE_KEY
GOOGLE_APPLICATION_CREDENTIALS="config\key-file.json"

under the service accounts tab, go to Keys and create a new key.
choose json. 
the saved json should be renamed to key-file.json and placed under /config of the web app file directory
inside the json there is an object called private key, copy and paste the whole key into the GCP_PRIVATE_KEY of the .env.local

![image](https://github.com/user-attachments/assets/2b4660da-b5b5-4765-8df4-f3bfc51a20f1)

![image](https://github.com/user-attachments/assets/76f2c585-75a9-40bd-b6e5-02fbde71979c)




## GCP_BUCKET_NAME
## GCP_BUCKET_SIGNATURES

Create a google cloud bucket and the name of the google cloud bucket should be added into the GCP_BUCKET_NAME & GCP_BUCKET_SIGNATURES

![image](https://github.com/user-attachments/assets/5ae0642a-4474-4ed9-8d3d-5923612935ed)


## OSA_EMAIL

email of the osa account that you want to be admin. could be your email for local testing any email under this would be granted the admin role.

## NEXTAUTH_SECRET

any 

## GOOGLE_CLIENT_SECRET
## GOOGLE_CLIENT_ID

![image](https://github.com/user-attachments/assets/6323248c-49c6-4f84-ace6-df4e75ed98b0)

in google cloud platform under credentials tab, create a new OAUTH client ID, the secret and the id generated should be placed here in the .env.local



