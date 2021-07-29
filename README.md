# Neo4 TS

Neo4TS is a Neo4J Wrapper Object modeling tool designed to work in an asynchronous environment. You can use it instead of writting queries.
Fully support Neo4J 3.0^ and 4.0^.

## Installation

First install Node.js Then:

```bash
npm install neo4ts
```

## Importing

```js
import { Neo4TS } from 'neo4ts'
```

## Overview

### Connecting

First we need to define our connection parameters. We have to import ConfigurationManager to set our configuration to connect to the DB.

```js
import { ConfigurationManagers } from "neo4ts";

ConfigurationManagers.setConfiguration({
  databaseUrl: 'bolt://mygraphdb:7687',
  databaseUser: 'user',
  databasePassword: 'mypass',
});
```

Once set the configuration Neo4TS will manage the driver connection for you, if you want to check the connection you can use:

```js
import { ConfigurationManagers } from "neo4ts";

ConfigurationManagers.isDriverOpen();
```

And you can close the connection if you prefer:

```js
import { ConfigurationManagers } from "neo4ts";

ConfigurationManagers.closeDriver();
```

### Making queries

You can build a Cypher Query Action by importing ```neo4ts`` and use one of the cypher query building 

```js
import { Neo4TS } from 'neo4ts';

const dbAction = Neo4TS.findAll({
  person: {
   labels: ['Human', 'Person'] 
  }
});
```

Then you can execute it asyncronous by calling the execute method 

```js
import { Neo4TS } from 'neo4ts';

const dbAction = Neo4TS.findAll(...)
  .execute()
  .then(res => console.log(res));
```

You can also look for the query string by calling the getQuery or getPrettyQuery for a more readable response.

```js
import { Neo4TS } from 'neo4ts';

const dbAction = Neo4TS.findAll(...).getQuery();
```
