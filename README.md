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

ScreenShots Attached for reference : 

