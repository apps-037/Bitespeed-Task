# Bitespeed-Task

## Steps for mysql db creation

Creation of Database and Table :

```sh
CREATE DATABASE IF NOT EXISTS Contact;

USE Contact;

CREATE TABLE IF NOT EXISTS Contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phoneNumber VARCHAR(255),
  email VARCHAR(255),
  linkedId INT,
  linkPrecedence ENUM('secondary', 'primary'),
  createdAt DATETIME,
  updatedAt DATETIME,
  deletedAt DATETIME
);

```
Clone the repository and run : 

```sh
npm install
```

To run the code :

```sh
npm run dev
```

## ScreenShots Attached for reference 

Original Database Table : 

<img width="1501" alt="Screenshot 2023-06-19 at 3 34 37 PM" src="https://github.com/apps-037/Bitespeed-Task/assets/60502274/caccfa00-426d-4b25-8f74-8e3e12e6bf71">

Inserting a new primary contact using /identify API : 

<img width="1502" alt="Screenshot 2023-06-19 at 3 36 26 PM" src="https://github.com/apps-037/Bitespeed-Task/assets/60502274/ef616a92-d560-4448-9bc2-afb6ca80eebc">

The primary contact row is added :

<img width="1014" alt="Screenshot 2023-06-19 at 3 37 09 PM" src="https://github.com/apps-037/Bitespeed-Task/assets/60502274/7b27c05a-b6b8-4448-bdc7-5a250dd304a8">

Creating a secondary contact for this primary contact :

<img width="1492" alt="Screenshot 2023-06-19 at 3 39 26 PM" src="https://github.com/apps-037/Bitespeed-Task/assets/60502274/ddb4bb92-9496-4441-9fe3-97131a06761f">

<img width="1064" alt="Screenshot 2023-06-19 at 3 41 22 PM" src="https://github.com/apps-037/Bitespeed-Task/assets/60502274/f6f10bbb-14f8-4998-92d0-3054bfa99046">

Convert primary to secondary :

Taking ids 28 and 34 for the demonstration :

<img width="990" alt="Screenshot 2023-06-19 at 3 43 34 PM" src="https://github.com/apps-037/Bitespeed-Task/assets/60502274/1d0e01e6-3b9b-4b3a-9e0d-3ab81aeea8d5">

<img width="1410" alt="Screenshot 2023-06-19 at 3 44 48 PM" src="https://github.com/apps-037/Bitespeed-Task/assets/60502274/6ff3db08-72ab-4f58-995d-d6acd84eace2">

Testing id 34 changes from primary to secondary with linkedId as 28 :

<img width="1068" alt="Screenshot 2023-06-19 at 3 45 37 PM" src="https://github.com/apps-037/Bitespeed-Task/assets/60502274/e06da067-5c73-4f3f-b423-2d267421fc01">
