# Ton-618 - Serverless API 🔭

## Description 📃

Serverless API for querying/storing information on black holes🕳️ discovered in our universe🌌.
This API is hosted in AWS and utilizes API Gateway, DynamoDB and Lambda λ services. Authorization with JWT can be enabled if needed/wabted. Both infrastructure and application code are stored in this repository. 

![Ton618](https://user-images.githubusercontent.com/81910142/229298520-71e257ed-e4e8-4583-b61a-1fb93ae9736f.png)


## Prerequisities 🛠️

```
❯ cdk --version
2.65.0
```

To enable authentication in this app, set up a JWT provider such as Auth0 or AWS Cognito.

If you choose to enable auth set up a .env file or create environment variables for JWT_ISSUER and JWT_AUDIENCE as they will be needed to set up an autorization for the API.

Not configuring these variables means the authorizer will not be attached to the POST route.

## How to deploy 🚀

### Stacks structure

```
❯ cdk ls
Ton618
Ton618/Db
Ton618/Network
Ton618/App
```

To keep things separate and avoid updating the entire stack when something changes in the app code the project is separated into 3 stacks. The application stack is dependant on both DB and Network stacks, as it requires a DB to reference/connect to and a VPC with Subnets in which the Lambda functions will be placed.

Deploy the Application with `❯ cdk deploy --all --profile {your_profile}`

Example output:

```
✅  Ton618/App

✨  Deployment time: 205.17s

Stack ARN:
arn:aws:cloudformation:...

✨  Total time: 247.33s
```

## Test and verify everything is working as expected ⚙️

If you decided to implement auth on the application, the routes should have JWT Authorizer attached to them. This can be seen under API Gateway Authorization:

![Screenshot 2023-03-11 133628](https://user-images.githubusercontent.com/81910142/224485110-51e5d2af-24d8-4395-993b-4da2ad0e6024.jpg)

### GET all blackholes 🕳️ from the DB Table

Listing all blackholes available in the DynamoDB table does not require authentication as can be seen in the screenshot above. Grab the API Invoke URL and create a GET request to the /blackholes route without a JWT token or request body.
Example Postman request:
![Screenshot 2023-03-11 134812](https://user-images.githubusercontent.com/81910142/224485540-a90e8915-20f2-44fc-85b1-7d898922bb61.jpg)
As the DB is empty, the GET request will return an empty array, but this will change when we start adding items to the table.

### POST a blackhole 🕳️

To add an item to the DB table, make sure you generate a JWT and add it to the request header. Trying to POST without a Bearer token should yield a result such as:
![Screenshot 2023-03-11 140544](https://user-images.githubusercontent.com/81910142/224486282-608db6bd-a3a8-4bea-89ad-35d5d8c2da4d.jpg)
If the token is provided, the response should change and look like the following:
![Screenshot 2023-03-11 140726](https://user-images.githubusercontent.com/81910142/224486352-277f3ea4-a062-41a5-9a5e-2323936ee57a.jpg)

Once you create an item, the GET request should display it the next time you create a request:
![Screenshot 2023-03-11 141129](https://user-images.githubusercontent.com/81910142/224486517-c75558a8-e6b3-4787-9042-6cdb788ed86b.jpg)

## Clean up 🧹

Tear down the infrastructure quick&easy with
`❯ cdk destroy --all --profile {your_profile}`
