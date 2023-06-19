import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';

interface Contact {
  email?: string;
  phoneNumber?: string;
}

interface ConsolidatedContact {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'Contact',
});

const app = express();
app.use(bodyParser.json());

app.post('/identify', (req: Request, res: Response) => {

  const contact: Contact = req.body;

  // Query the database to fetch primary contacts
  connection.query(
    'SELECT * FROM Contact WHERE email = ? OR phoneNumber = ?',
    [contact.email, contact.phoneNumber],
    (error, results) => {
      if (error) {
        console.error('Error fetching primary contacts:', error);
        res.sendStatus(500);
        return;
      }

    console.log("Print the results", results);

    });

});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


