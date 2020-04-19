## Steps for setting up the back end for Smart Shopping App and run the application locally

### 1 - Node.js installation

Download the latest version according to your OS version here: https://nodejs.org/en/download/

Then open the exe file and install the application following the instructions

### 2 - MongoDB Community Server installation

Download the latest version according to your OS version here: https://www.mongodb.com/download-center/community

Then open the exe file and install the application following the instructions

### 3 - Robo3T installation

Download the latest version according to your OS version here: https://robomongo.org/download

Then open the exe file and install the application following the instructions

Robo3T allows us to manage MondoDB databases locally


### 4 - Node.js first steps

Open the back-end-code folder in Visual Studio Code or similar source-code editor (download VSC here: https://code.visualstudio.com/download)

Open a new terminal inside Visual Studio Code

Delete the ``package.json`` file situated in the main folder

Run the following statement:

`` npm start ``


### 4 -  Installing packages with npm

Now all the external dependencies should be installed. Run the following statement in the terminal:

``npm install nodemon mongoose express passport passport-local passport-local-mongoose node-cron body-parser morgan method-override axios cheerio --save``

### 5 - Set up mongodb server

Open another terminal and go to the folder where Mongodb server is install, specifically to this location:
``C:\Program Files\MongoDB\Server\4.0\bin``

Then run the following: ``./mongod``

After that the server should be initiated properly and we can connect our app with mongodb

### 6 - Robo3T setup

Open the Robo3T application nd create a new database named SSA and the connect to it


### 7 - Run application

Write the following statement in the first terminal:
``nodemon index.js``


### 8 - Back office login

Open the browser (chrome is the best option) and go to: 
``http://localhost:5000/``

Then enter the following credentials:

username: backend

password: backend

After login the app won't show data in Countdown and NWM because there is no data in the database

Go to Options -> Press the button GET DATA from Countdown and GET DATA from NWM

Now the application should create all the categories collections and products from both shops.

That data can be access in the back office going to -> COUNTDOWN DATA and NEW WORLD DATA (access from the navigation bar)

Can be access in Robo3T as well.

### 9 - Extra notes

Now the application is set up to perform web scraping in COUNTDOWN and NWM shops, taking all the categories names and 5 pages of 24 and 20 products from each one respectively.

### Created by Diego Evangelisti. April, 2019
