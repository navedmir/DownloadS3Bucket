# DownloadS3Bucket

  Downloads all objects in a given S3 bucket recursively and saves them locally using node.js.


#### Set Env variables

Set the variables in .env file where 
bucketName  - name of the bucket you want to download
access_key_id - access key for aws s3
secret_access_key - secret access key for aws s3
region - aws region

### Running the application!

Requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ npm install 
$ npm start
```

Alternatively you can run using babel-node

### Test
It uses jest for testing.
```sh
$ npm run test
```

You can also view the test report by opening, the generated jest_html_reporters.html

**Note:-** there are only view basic unit test written

### Todos

 - Write more test(mocking aws etc)
 - Add dev mode(run using babel-node)





