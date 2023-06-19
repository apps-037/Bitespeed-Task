import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';

interface Contact {
  email?: string;
  phoneNumber?: string;
}

interface ConsolidatedContact {      //final response format
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
  const consolidatedContact: ConsolidatedContact = {
    contact: {
      primaryContactId: 0,
      emails: [],
      phoneNumbers: [],
      secondaryContactIds: [],
    },
  };

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

      if (results.length > 0) {
        const primaryContact = results[0];

        // Populate primary contact data
        consolidatedContact.contact.primaryContactId = primaryContact.id;

        // Add primary contact email if not already present
        if (!consolidatedContact.contact.emails.includes(primaryContact.email)) {
          consolidatedContact.contact.emails.push(primaryContact.email);
        }

        // Add primary contact phone number if not already present
        if (!consolidatedContact.contact.phoneNumbers.includes(primaryContact.phoneNumber)) {
          consolidatedContact.contact.phoneNumbers.push(primaryContact.phoneNumber);
        }

        // Query the database to fetch secondary contacts
        connection.query(
          'SELECT * FROM Contact WHERE linkedId = ?',
          [primaryContact.id],
          (error, secondaryResults) => {
            if (error) {
              console.error('Error fetching secondary contacts:', error);
              res.sendStatus(500);
              return;
            }
            // Add secondary contact data to the response 
            secondaryResults.forEach((secondaryContact: any) => {
              consolidatedContact.contact.secondaryContactIds.push(secondaryContact.id);

              // Add secondary contact email
              if (secondaryContact.email && !consolidatedContact.contact.emails.includes(secondaryContact.email)
              ) {
                consolidatedContact.contact.emails.push(secondaryContact.email);
              }
              // Add secondary contact phone number 
              if (secondaryContact.phoneNumber && !consolidatedContact.contact.phoneNumbers.includes(secondaryContact.phoneNumber)
              ) {
                consolidatedContact.contact.phoneNumbers.push(secondaryContact.phoneNumber);
              }
            });


            // Send the consolidated contact data
            res.status(200).json(consolidatedContact);

          });
      }

    });

});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


