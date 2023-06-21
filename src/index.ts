import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import { Console } from 'console';

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

console.log("print conn", connection);

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

  // Helper function to send the consolidated contact data
  const sendConsolidatedContact = () => {
    res.status(200).json(consolidatedContact);
  };

  // Here the primary gets converted to secondary
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
        // Check if any primary contact shares the same information
        const sharedPrimaryContacts = results.filter(
          (primaryContact: any) => primaryContact.linkPrecedence === 'primary'
        );

        if (sharedPrimaryContacts.length > 1) {
          // Sort primary contacts by creation date in ascending order
          sharedPrimaryContacts.sort(
            (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

          // Update the latest primary contact to secondary
          const latestPrimaryContact = sharedPrimaryContacts.pop();
          connection.query(
            'UPDATE Contact SET linkPrecedence = ?, updatedAt = ? WHERE id = ?',
            ['secondary', new Date(), latestPrimaryContact.id],
            (error) => {
              if (error) {
                console.error('Error updating latest primary contact:', error);
                res.sendStatus(500);
                return;
              }
            }
          );

          // Set linkedId as the oldest primary contact ID
          const oldestPrimaryContact = sharedPrimaryContacts[0];
          connection.query(
            'UPDATE Contact SET linkedId = ? WHERE id = ?',
            [oldestPrimaryContact.id, latestPrimaryContact.id],
            (error) => {
              if (error) {
                console.error('Error updating linkedId for secondary contact:', error);
                res.sendStatus(500);
                return;
              }
            }
          );
        }

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
              if (secondaryContact.email && !consolidatedContact.contact.emails.includes(secondaryContact.email)) {
                consolidatedContact.contact.emails.push(secondaryContact.email);
              }

              // Add secondary contact phone number
              if (secondaryContact.phoneNumber && !consolidatedContact.contact.phoneNumbers.includes(secondaryContact.phoneNumber)) {
                consolidatedContact.contact.phoneNumbers.push(secondaryContact.phoneNumber);
              }
            });

            // Check if incoming request contains new information
            const hasNewInfo =
              (contact.email && !consolidatedContact.contact.emails.includes(contact.email)) ||
              (contact.phoneNumber && !consolidatedContact.contact.phoneNumbers.includes(contact.phoneNumber));

            if (hasNewInfo) {
              // Create a new secondary contact
              const newContact = {
                email: contact.email,
                phoneNumber: contact.phoneNumber,
                linkPrecedence: 'secondary',
                linkedId: primaryContact.id,
              };

              connection.query('INSERT INTO Contact SET ?', newContact, (error, result) => {
                if (error) {
                  console.error('Error creating new secondary contact:', error);
                  res.sendStatus(500);
                  return;
                }

                const newSecondaryContactId = result.insertId;
                consolidatedContact.contact.secondaryContactIds.push(newSecondaryContactId);

                // Send the consolidated contact data
                sendConsolidatedContact();
              });
            } else {
              // Send the consolidated contact data without creating a new secondary contact
              sendConsolidatedContact();
            }
          }
        );
      } else {
        // Create a new primary contact if no matching contact found
        const newContact = {
          email: contact.email,
          phoneNumber: contact.phoneNumber,
          linkPrecedence: 'primary',
        };

        connection.query('INSERT INTO Contact SET ?', newContact, (error, result) => {
          if (error) {
            console.error('Error creating new primary contact:', error);
            res.sendStatus(500);
            return;
          }

          const newPrimaryContactId = result.insertId;
          consolidatedContact.contact.primaryContactId = newPrimaryContactId;

          // Send the consolidated contact data
          sendConsolidatedContact();
        });
      }
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


