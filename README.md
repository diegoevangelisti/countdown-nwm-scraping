## Smart Shopping Application. Web scraping + RESTful API + Server + Admin Panel

This app performs web scraping to collect information related with products from two big New Zealand supermarkets.
Uses cheerio.js to perform DOM manipulation on the server side and get data about their categories, product names, prices, offers, etc.
The database in NoSQL (MongoDB), the main server side programming language is Node.js. Also a little bit of EJS (template enginee) and the classic (bad still alive) HTML+CSS+JavaScript+jQuery approach for the Admin Panel (FrontEnd).
Last, but not least, the RESTful API that feed the main FrontEnd (a beatiful iOS app that is not hosted here) is deplayed in Heroku.
Enjoy!


## Setting up the server, database and admin panel to run the app locally 

### 1, 2 and 3- Node.js, MongoDB Community Server and Robo3T installation
Download their latest versions according to your OS version:

- https://nodejs.org/en/download/
- https://www.mongodb.com/download-center/community
- https://robomongo.org/download

Then open the exe files, install the applications, and follow the instructions

### 4 - Close this repository and prepare de Node server
In the terminal run:

`` git clone https://github.com/diegoevangelisti/countdown-nwm-scraping ``

Run the following statement:

`` cd countdown-nwm-scraping ``

`` npm init ``

`` npm install --save``

### 5 - Set up mongodb server
Open another terminal and go to the folder where Mongodb server is installed - in windows:
``C:\Program Files\MongoDB\Server\4.0\bin``

Then run: ``./mongod``

After that the server should be properly running and we can connect our app to mongodb

### 6 - Robo3T setup
Open the Robo3T application nd create a new database named SSA and then connect to it

### 7 - Run application
In the terminal type:

``node index.js``

### 8 - Back office login
Open the browser and go to: 
``http://localhost:5000/``

Then enter the following credentials:

username: backend
password: backend

After login the app won't show data in Countdown and NWM because there is no data in the database

Go to `Options -> Get Data` (Countown and New World)

That data can be visualized in the back office going to:  `Options -> COUNTDOWN DATA` and `NEW WORLD DATA` 
Can be checked in Robo3T as well.

### 9 - Extra notes
Now the application is configured to perform web scraping in Countdown and New World shops.
Setup: Takes all the categories, and scrapes 5 pages of 24 and 20 products from each supermarket respectively.

### Created by Diego Evangelisti. April, 2019
