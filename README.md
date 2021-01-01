# WheresCovid.ca

An web application built to track and report COVID-19 in Canada. 

The application is built off of FSA (Forward Sortation Area) codes from stats Canada which can be found [here](https://www12.statcan.gc.ca/census-recensement/2011/geo/bound-limit/bound-limit-2016-eng.cfm ).

### How it works

A user will create an account and login. For the first time, the user will be prompted with a short questionnaire, which they must complete. The questionnaire will pose a series of questions, such as their COVID-19 status, and the first three letters of their postal code. Once completed, the user will presented with a dashboard of their geographic region, and will be able to see data about COVID-19 cases around their area.

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

As this is a Node.js application the following are required to get the project running.
The NPM tool is also required to download web app dependencies.

```javascript
Node v11.6.0 or higher
PostgreSQL 12.2 or higher
```

### API Configurations

```
1. Clone the repository
2. Navigate api/bin/www and on line 17 ensure that port has or display the || option to 9000.
3. Navigate to api/apps.js, and on line 84 copy your database end point there.
```

### Database Configurations

This project depends on both `MySQL` and `express-sessions` during production. They will need to be installed independently following specific instructions for your production environment.

#### 

