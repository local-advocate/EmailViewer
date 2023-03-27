# EmailViewer
A very simple and basic Email viewer. Users have the ability to sign in and view prestored emails.  
* Emails are sorted by formatted dates. 
* Unread emails are displayed in bold and starred emails are highlighted.
* Advanced features such as sending emails, switching mailboxes, starring emails, etc. are removed because they were not yet fully tested.
* Technology stack: TypeScript, ExpressJS, NodeJS, React, PostgreSQL, OpenAPI.

## Demonstration
YouTube Link:   
[![EmailViewer Demonstration](https://github.com/local-advocate/EmailViewer/blob/main/EmailViewer.PNG)]( "EmailViewer Demonstration")

## Scripts
The following commands are meant to be run from the most parent directory of this repository.

```bash
# Install the required modules
npm run install-backend
npm run install-frontend
```
```bash
# Start the database (uses port 5432, by default)
cd backend
docker-compose up -d
```
```bash
# Run the server (uses port 3000 and 3001, by default)
npm run start-backend
npm run start-frontend
```
```bash
# Build
cd frontend && npm run build
```
```bash
cd backend && npm run test   # Run backend tests
cd frontend && npm run test  # Run frontend tests
cd e2e && npm run test       # Run end-to-end tests

cd backend && npm run lint   # Lint check backend
cd frontend && npm run lint  # Lint check frontend
```

## Sample Users

| Email                     | Password    |
| -----------               | ----------- |
| anna@books.com            | annaadmin   |
| molly@books.com           | mollymember |
| averev@shareasale.com     | Andy Vere   |
