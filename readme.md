
# Contacts App
Description: A simple CRUD app that allows functionality to store contact details such as email, phone, name.
This application was built using the express JS framework. It serves  html, css and javascript file for the frontend and serves an API.
The application exposes an API where actions such as creating a contact, searching for a contact, editing a contact or deleting the contact can be performed.
There is also a frontend available to perform CRUD actions. 

## Data Store for Contacts
The application saves contacts in a json file (contacts.json). If this file does not exist it is created by default.

## The backend (API)
The backend is an API that sends and receives JSON. The route created are
1. **Create contact** (POST-/api/contacts)
2. **Get all contacts** (GET-/api/contacts)
3. **Search by First Name** (GET-/api/contacts/firstname/${firstname})
4. **Search by Last Name** (GET- /api/contacts/lastname/${lastname})
5. **Search by Id** (GET- - /api/contacts/id/${id})
6. **Delete Contact** (DELETE- /api/contacts/${id})
7. **Edit Contact** (PATCH - /api/contacts/${id})

examplt payload when making a post or PATCH
```json
{
    "email": "test@gmail.com",
    "phone": "08091121109",
    "firstName": "John",
    "lastName": "Doe"
}

```

## The Frontend
The express application serves the public folder which serves a HTML, CSS, and javascript file. The frontend uses the fetch API to perform actions on the API such as creating, deleting, reading and updating contact details. It also modifies selected areas of the DOM to update users
Upon loading the app, saved contacts are loaded. Users can create a new contact, edit a contact and delete a contact.

## Run Locally

Clone the project

```bash
  git clone https://github.com/Amasaabu/contacts-app
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

The application will be running at `http://localhost:3000`.
## Deployment Guide

Since this is a single and simple application, I suggest running the application in an AWS EC2 instance. Also setting up a deployment pipeline using github ations to automate the deployment of the application to the EC2 instance (t2.micro running Ubuntu)

Ensure You are **Signed into** the AWS console and have proper **IAM permissions** setup on your user account

### First-Time Setup
#### Step 1: Create an EC2 instance from the AWS console (Recomended to use an Ububtu based AMI)
#### step 2: Setup security group to allow traffic into the application on the port (default is 3000) and allow access on the ssh port (22)
#### Step 3: ssh into the instance update the list of available packages and then install node and npm
```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```
#### Step 4: Clone the application in the instance
```bash
git clone https://github.com/Amasaabu/contacts-app
```
#### step 5: cd into the cloned repository and install the application dependencies.
```bash
npm install
```

#### Step 6: Install pm2 globally, a tool that allows a node js application to be restarted incase of failures and useful to run the node js application as a background process, so that closing the terminal session does not stop running the application- In summary a process manageer for Node JS application
```bash
sudo npm install pm2 -g
```
#### Step 7: Finally the application can now be started 
```bash
pm2 start index.js
```
The application should now be accessible at the EC2 instance IP on port 3000.

## Setting up an automated deployment pipeline using github actions


### How Github Actions Work
Github actions allows for the automation of workflows for a project. Basically a set of actions are defined and are executed when certain code chanfes occurs such as  apush to the applications repository. 

To run the pipeline the approach I am going with is to use github actions as it is easy to use, cheaper as it is only run whenever there is a code change, and we don't have to manage any servers as is the case with jenkins.
### Steps to setup automated deployment
1. Inside the project repository, create a .github/workflows directory
2. Within this repository creae a deploy.yml file
3. Define a workflow file, bellow is an example of a workflow file that automates the deployment process:
```bash
 ssh -o StrictHostKeyChecking=no -i private_key ${{ secrets.USERNAME }}@${{ secrets.HOST }} << EOF
            echo "PORT=${{ secrets.PORT }}" > /home/ubuntu/contacts-app/.env
          EOF
```

``` yaml
name:  actions
on:
  push:
    branches:
      - main
env:
  PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
  USERNAME: ${{ secrets.USERNAME }}
  HOST: ${{ secrets.HOST }}
jobs:
  TRIGGER_UPDATE:
    runs-on: ubuntu-latest
    steps:
      - name: checkout code
        uses: actions/checkout@v4

      - name: Transfer and deploy code
        run: |
          echo "Setting up the environment"
          echo "${{ env.PRIVATE_KEY }}" > private_key 
          chmod 600 private_key
          scp -o StrictHostKeyChecking=no -i private_key -r ./* ${{ env.USERNAME }}@${{ env.HOST }}:/home/ubuntu/api
          echo "Code transferred successfully"
          echo "Creating .env file with secrets"
          ssh -o StrictHostKeyChecking=no -i private_key ${{ secrets.USERNAME }}@${{ secrets.HOST }} << EOF
            echo "PORT=${{ secrets.PORT }}" > /home/ubuntu/app/.env
          EOF

          echo "Starting SSH session to deploy"
          ssh -o StrictHostKeyChecking=no -i private_key ${{ secrets.USERNAME }}@${{ secrets.HOST }} << EOF
            cd /home/ubuntu/app/
            sudo npm install
            pm2 stop index.js
            pm2 start index.js --node-args="--env-file .env"
            echo "Deployment complete"
          EOF
```
### Summary of what each step does
1. The workflow is triggered by a push event to the main branch
2. values such as PRIVATE_KEY, USERNAME and HOST are stored as github secretes This values needs to be added under settings>secrets. They will be used to access the EC2 instance
3. The private_key is used to ssh into the setup EC2 instance
4. Using scp the code is transfered from the github runner into the EC2 insrace
5. Install Dependencties and restart the application. After the code has been transfered into the EC2 instance, the Node JS dependencies are installed using npm insall, after which the application is restarted with pm2

This workflow automates the deployment process for every psh made to the application repository

### Other deployment techniques and environment that could be used
1. AWS lightsail which is an AWS service that plugs into the application repository and automates the whole process
2. Containerizing the application with docker and deploying it in a kuberentes cluster
3. Using a Platform as a service tool such as Heroku