# Neo4 TS

Hello my name is Carlos aka Kingskull619, [Neo4TS](https://github.com/kingskull619/Neo4Ts) is a beta project made by me, as a necesity from various projects I'm working on.
Is a in progress project, feel free to fork and help if you want.

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

## Table of Content
- [Neo4 TS](#neo4-ts)
  * [Installation](#installation)
  * [Importing](#importing)
  * [Overview](#overview)
    + [Connecting](#connecting)
    + [Making queries](#making-queries)
  * [GraphAbstraction object](#graphabstraction-object)
    + [GraphEntity](#graphentity)
      - [Labels](#labels)
      - [Id](#id)
      - [isReturnable](#isreturnable)
      - [isOptional](#isoptional)
      - [isTargeteable](#istargeteable)
      - [Properties](#properties)
        * [Primitive values](#primitive-values)
        * [Object values](#object-values)
        * [GraphPropertyDefinition](#graphpropertydefinition)
          + [Value and Type](#value-and-type)
          + [Filtering capabilities](#filtering-capabilities)
          + [isFilter](#isfilter)
          + [Condition](#condition)
          + [Operator](#operator)
    + [GraphRelationship](#graphrelationship)
      - [Source](#source)
      - [Target](#target)
  * [Database Actions](#database-actions)
  * [Action Builders](#action-builders)
    + [Find All](#find-all)
      - [Pagination](#pagination)
    + [Find one](#find-one)
    + [Create](#create)
    + [Create Multiple](#create-multiple)
    + [Update](#update)
      - [Filtering before update](#filtering-before-update)
    + [Update Multiple](#update-multiple)
    + [Delete](#delete)
    + [Delete Multiple](#delete-multiple)
    + [Raw Cypher](#raw-cypher)
  * [The Execute Function](#the-execute-function)
  * [The Get Query Function](#the-get-query-function)
  * [The Get Params For DB Use Function](#the-get-params-for-db-use-function)
  * [The Get Pretty Query Function](#the-get-pretty-query-function)
  * [Override Return function](#override-return-function)
  * [Return object](#return-object)
    + [Return Object when default behaviour modified](#return-object-when-default-behaviour-modified)

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

You can build a Cypher database Action by importing ```neo4ts``` and use one of the cypher cypher building action to perform and execute cypher queries to the database.

A [Cypher Database Action](#database-actions) is a virtual container for a [GraphAbstraction](#graphabstraction-object) which later can be translated into a valid cypher query with special capabilities or executed to a database.

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

This will return the query as:
```txt
MATCH (person :Human:Person) return person
```
## GraphAbstraction object
A graph abstraction is an JS Object which represnts a set of graph entities structured in the Database. There is two main abstractions:

* **Node**: called [GraphEntity](#graphentity)
* **Relationships**: called [GraphRelationship](#graphrelationship)

Both share most of the functionality with a tiny difference, _Relationships_ have two additional properties: ```from```|```source``` and ```to```|```target```.

You can create a ```GraphAbstraction``` by importing and using:

```ts
import { Neo4TSTypes } from 'neo4ts';

const graphAbstraction: Neo4TSTypes.GraphAbstraction = {};
```
A graph abstraction type is defined as: ```Record<string, GraphEntity | GraphRelationship>```. Which implies an JS Object containing N number of properties being GraphEntities or GraphRelationships.

For example:

```ts
const graphAbstraction: Neo4TSTypes.GraphAbstraction = {
  node: {}
};
```

The ```node``` name will be used by Neo4TS as an alias for the queries generated by the lirabry. The object as mentioned before is a ```GraphEntity | GraphRelationship``` that will be used by the library.

### GraphEntity
A Graph entity is an abstract representations of a [Node in Neo4J DB](https://neo4j.com/docs/getting-started/current/graphdb-concepts/#graphdb-nodes). Is defined as a JS Object containing multiple properties.

#### Labels

```ts
label?: string | string[];
labels?: string | string[];
```

As in Neo4J Nodes can be added and grouped by a set of [labels](https://neo4j.com/docs/getting-started/current/graphdb-concepts/#graphdb-labels), you can add labels to your ```GraphEntity``` by using one of the following properties:

* label
* labels

Both single and plural representation are valid to represent a label ino a ```GraphEntity```.

```ts
const example1: GraphEntity = {
  label: 'MyLabel'
};

const example2: GraphEntity = {
  labels: 'MyLabel'
}
```

Both ```example1``` and ```example2``` have the same effect for representating an Entity with a label.

You can also define a collection of labels, by passing an array instead of an string.

```ts
const example1: GraphEntity = {
  label: ['MyLabel', 'MySecondLabel']
};

const example2: GraphEntity = {
  labels: ['MyLabel', 'MySecondLabel']
}
```

#### Id
```ts
 id?: string | number;
```
You can set the id of your Entity by using the id property, this is a reference to the native [ID key of Neo4J](https://neo4j.com/docs/cypher-manual/4.3/functions/scalar/#functions-id)

```ts
const entity: GraphEntity = {
  id: 1
};
```

#### isReturnable
```ts
isReturnable?: boolean
```

Is returnable will define if the entitie will be returned once the action is executed in the database.
By default all entities have ```isReturnable``` set to ```TRUE```.

#### isOptional
```ts
isOptional?: boolean
```
When Neo4TS is building the match pattern to use in cypher it will look for the ```isOptional``` propertie to decide between MATCH or OPTIONAL MATCH.
By default all entities have ```isOptional``` set to ```FALSE```.

#### isTargeteable
```ts
isTargeteable?: boolean
```
This property is used to mark entities to be target when used for actions:
* [Create Multiple](#create-multiple)
* [Update Multiple](#update-multiple)
* [Delete Multiple](#delete-multiple)


#### Properties
```ts
properties?: Record<string, GraphProperty>
```
```ts
type GraphProperty =
    | string
    | number
    | boolean
    | Date
    | string[]
    | number[]
    | boolean[]
    | GraphPropertyDefinition
    | Record<string, any>;
```
You can set properties, to you abstraction, this will be usefull for filtering your data, or to create and update data of a certain entitiy, look for more on actions.

a property is a JS Object where the property name will be used as the database property name.

```ts
const entity: GraphEntity = {
  properties: {
    name: 'my name'
  }
};
```

##### Primitive values
Neo4TS support many primitive values, and will infer the correct type to save it to the Neo4J Database.

* string
* number
* boolean
* Date
* string[ ]
* number[ ]
* boolean[ ]

##### Object values
As you can see on the type definitionfor ```GraphProperty``` it also support objects by ```Record<string, any>```.

**Neo4TS will convert them into JSON string to use them either for saving or filtering**

##### GraphPropertyDefinition
You can define more complex features from properties using an object called ```GraphPropertyDefinition```.
A graph property definition is an special JS Object to define a property value and extra capabilities.

All ```GraphPropertyDefinition``` objects should contain ```type``` and ```value``` properties, the rest of them are optional extra features.

```ts
const entity: GraphEntity = {
  properties: {
    name: {
      type: 'string',
      value: 'my name'
    }
  }
};
```

###### Value and Type
A ```GraphPropertyDefinition``` should define a value and type that will be used on this property. Supported types are:

```ts
| 'integer'
| 'number'
| 'float'
| 'boolean'
| 'string'
| 'date'
| 'time'
| 'datetime'
| 'array'
```

This is usefull because you can set a different primitive type in the value property, and Neo4TS will parse to the correct type to use it into the Database.

```ts
const entity: GraphEntity = {
  properties: {
    name: {
      type: 'string',
      value: 100
    }
  }
};
```

In the previous expample value is a number but type property is defined as string, so when is used to filter or setting data into the database it will be transformed to a string value.

This is also usefull to work with Dates, **as default Neo4TS will threat all Dates as DateTime types for Neo4J**, but by using a ```GraphPropertyDefinition``` you can switch this behaviour to use: ```time```, ```date``` or ```datetime```.

```ts
const entity: GraphEntity = {
  properties: {
    timeOfDelivery: {
      type: 'time',
      value: new Date()
    }
  }
};
```

###### Filtering capabilities
In some cases you want to use the ```GraphPropertyDefinition``` to filter your data. Neo4TS provide some capabilities to filter them.

###### isFilter
Some times Neo4TS will need you to define if the property definition will be used as a filter. By default most actions will use the properties as they need if they have to filter or to set data, but in some actions like [Update Action](#update) may require you to use ```isFilter``` to differenciate the behaviour.

```ts
const entity: GraphEntity = {
  properties: {
    timeOfDelivery: {
      type: 'time',
      value: new Date(),
      isFilter: true
    }
  }
};
```


###### Condition
As default Neo4TS will use the equal condition to compare when using properties as filters. If you want to change this behaviour you can use the Condition property to alter it.

The conditions supported are:

```ts
//following strings are threated as equality
| 'equal'
| '='
//following strings are threated as different
| 'different'
| '<>'
| '!='
//following strings are threated as contain, case insensitive
| 'contains'
//following strings are threated as not contain, case insensitive
| 'not contains'
| '!contains'
//following strings are threated as start with, case insensitive
| 'starts'
| 'starts with'
//following strings are threated as ends with, case insensitive
| 'ends'
| 'ends with'
//following strings are threated as greater
| 'greater'
| '>'
//following strings are threated as greater or equal
| 'greaterequal'
| 'greater equal'
| 'equalgreater'
| 'equal greater'
| '>='
//following strings are threated as lower
| 'lower'
| '<'
//following strings are threated as lower or equal
| 'lowerequal'
| 'lower equal'
| 'equal lower'
| 'equal lower'
| '<='
//following strings are threated as in array (provide an array as value)
| 'in'
//following strings are threated as if value is in property array (provide a primitive value)
| '!in'
| 'reversein'
| 'reverse in';
```
For example if we want to filter data for all persons with age of 15 or greater:

```ts
const person: GraphEntity = {
  properties: {
    age: {
      type: 'number',
      value: 15,
      condition: '>='
    }
  }
};
```

###### Operator
Neo4TS will use AND as the default operator, use the operator property, filters will respect the properties and entities order for chaining filters.

Operators values supported:
```ts
| 'and'
| 'or'
| 'xor'
| 'not'
```

For example if we want to filter data for all persons with age of 15 or Mexican nationality:

```ts
const person: GraphEntity = {
  properties: {
    age: {
      type: 'number',
      value: 15,
      condition: '>='
    },
    nationality: {
      type: 'string',
      value: 'mexican',
      condition: 'contains',
      operator: 'or'
    }
  }
};
```

### GraphRelationship
Relationshiips share all functionalities from [GraphEntity](#graphentity), in fact it's an extension of the same type.
The difference is that relationships will have a ```source``` and ```target``` properties to identify it as a relationship.

Both source and target are ```string``` properties, this string is the alias identifier of an existing [GraphEntity](#graphentity) inside a [GraphAbstraction](#graphabstraction-object)

```ts
const abstraction: GraphAbstraction = {
  nodeSource:   { label: 'person' }
  nodeTarget:   { label: 'dog' },
  relationship: { label: 'HAS', from: 'nodeSource', to: 'nodeTarget' }, // <==
};
```

#### Source
Source can be defined by one of the following properties:

* from
* source

```ts
const abstraction: GraphAbstraction = {
  nodeSource:   { label: 'person' }
  nodeTarget:   { label: 'dog' },
  relationshipEX1: { label: 'HAS', from: 'nodeSource', to: 'nodeTarget' }, // <==
  relationshipEX2: { label: 'HAS', source: 'nodeSource', to: 'nodeTarget' }, // <==
};
```
In the previous example both ```relationshipEX1``` and ```relationshipEX2``` have the same effect.

#### Target
Target can be defined by one of the following properties:

* to
* target

```ts
const abstraction: GraphAbstraction = {
  nodeSource:   { label: 'person' }
  nodeTarget:   { label: 'dog' },
  relationshipEX1: { label: 'HAS', from: 'nodeSource', to: 'nodeTarget' }, // <==
  relationshipEX2: { label: 'HAS', from: 'nodeSource', target: 'nodeTarget' }, // <==
};
```
In the previous example both ```relationshipEX1``` and ```relationshipEX2``` have the same effect.

## Database Actions
A Cypher Database Action is a virtual container for a [GraphAbstraction](#graphabstraction-object) which later can be translated into a valid cypher query with special capabilities or executed to a database.

Neo4TS provides severall action builders to perform to the Neo4J Database.
All core of the Neo4TS library is to provide this action builders.

You can use the action builders by importing:

```ts
import { Neo4TS } from 'neo4ts';
```
There you will find the multiple action builders provided by Neo4TS.

## Action Builders
### Find All
The find all action, when executed will retrieve all entities in the database, that match the [GraphAbstraction](#graphabstraction-object) defined.

```ts
import { Neo4TS } from 'neo4ts';

//Find all people that have a dog
const action: DBAction = Neo4TS.findAll({
  person: { label: 'person' },
  dog: { label: 'dog' },
  has: { from: 'person', label: 'HAS', to: 'dog' }
});
```
#### Pagination

Find all has pagination capabilities, it can accept a ```page``` and ```size``` as second and third parameters.

```ts
import { Neo4TS } from 'neo4ts';

//Find people that have a dog in page 2 with page size of 10
const action: DBAction = Neo4TS.findAll({
  person: { label: 'person' },
  dog: { label: 'dog' },
  has: { from: 'person', label: 'HAS', to: 'dog' }
}, 2, 10);
```

### Find one
Find one acts as [Find All](#find-all), but it will only return one [row result](#return-object).


```ts
import { Neo4TS } from 'neo4ts';

//Find the first person with name equal to 'Carlos'
const action: DBAction = Neo4TS.findOne({
  person: { 
    label: 'person',
    properties: {
      name: 'Carlos'
    }
  }
});
```
### Create
Create is used to create a signle entity into the database, it receives a [GraphAbstraction](#graphabstraction-object) and a ```string``` property which will declare the target [GraphEntity](#graphentity).

**Create will only create one single entity, if you want to create multiple entities in one single query use [Create Multiple Action](#create-multiple)**

**Is worth to mention that all Relationships tied to the target will be created aswelll if the entity is a Node**

```ts
import { Neo4TS } from 'neo4ts';

//Create a dog named 'Hunter' and set his owner as Carlos
const action: DBAction = Neo4TS.create({

  dog: {
    label: 'dog',
    properties: { name: 'Huner' }
  },
  person: { 
    label: 'person',
    properties: { name: 'Carlos' }
  },
  has: { from: 'person', to: 'dog', label: 'HAS' }

}, 'dog'); //<== don't forget to set the target to create
```

### Create Multiple
Create multiple is used to generate multiple entities at once into the database, it receives a [GraphAbstraction](#graphabstraction-object) with some entities marked as [isTargeteable](#istargeteable). Neo4TS will create the entities marked.

Create a dog and person inside a house:
```ts
import { Neo4TS } from 'neo4ts';

const action: DBAction = Neo4TS.createMultiple({
  house: {id: 1},
  dog: {
    label: 'dog',
    properties: { name: 'Huner' },
    isTargeteable: true, //<== don't forget to set it as the target
  },
  person: { 
    label: 'person',
    properties: { name: 'Carlos' },
    isTargeteable: true, //<== don't forget to set it as the target
  },
  has: { from: 'person', to: 'dog', label: 'HAS' },
  livesIn: { from: 'person', to: 'house', label: 'LIVES_IN'},
}); 
```

### Update
Update is an action used to set data to a single entity into the database, it receives a [GraphAbstraction](#graphabstraction-object) and a ```string``` property which will declare the target [GraphEntity](#graphentity).

**Update will work for a single entity, if you want to update more than one check: [Update Multiple Action](#update-multiple)**

```ts
import { Neo4TS } from 'neo4ts';

//Update the name of the dog with id 1 to 'Muzzarella'
const action: DBAction = Neo4TS.update({

  dog: {
    label: 'dog',
    id: 1,
    properties: { name: 'Muzzarella' }
  },

}, 'dog'); //<== don't forget to set the target to update
```

#### Filtering before update
Some times we doesn't have the ID to filter our entities, so we would like to filter first before updating values.
For it, when setting properties, use the property [isFilter](#isfilter) to know that this property will not be used to set values but to filter data.

```ts
import { Neo4TS } from 'neo4ts';

//Update the name of the dog wich age is 3 to 'Muzzarella'
const action: DBAction = Neo4TS.update({

  dog: {
    label: 'dog',
    properties: { 
      age: {
        type: 'number',
        value: 3,
        isFilter: true
      },
      name: 'Muzzarella'
    }
  },

}, 'dog'); //<== don't forget to set the target to update
```
### Update Multiple
Update multiple with set data to multiple entities at once into the database, it receives a [GraphAbstraction](#graphabstraction-object) and look for entities marked as [isTargeteable](#istargeteable) to know which entities will update. It will took the same rule for [filtering data](#filtering-before-update).

```ts
import { Neo4TS } from 'neo4ts';

//Update the name of a dog and person
const action: DBAction = Neo4TS.updateMultiple({
  dog: {
    id: 1,
    properties: { name: 'Muzzarella' },
    isTargeteable: true, //<== don't forget to set it as the target
  },
  person: {
    id: 2,
    properties: { name: 'Victoria' },
    isTargeteable: true, //<== don't forget to set it as the target
  }
});
```


### Delete
Delete is an action used to delete an entity on the database, it receives a [GraphAbstraction](#graphabstraction-object) and a ```string``` property which will declare the target [GraphEntity](#graphentity).

**Delete will only delete one entity abstraction, if you want to delete multiple entities use [Delete Multiple Action](#delete-multiple)**

```ts
import { Neo4TS } from 'neo4ts';

//Deleting a dog with id 1
const action: DBAction = Neo4TS.delete({

  dog: {
    label: 'dog',
    id: 1,
  },

}, 'dog'); //<== don't forget to set the target to update
```

### Delete Multiple
Delete Multiple will create an action used to delete multiple entities in the database, it receives a [GraphAbstraction](#graphabstraction-object) and look for entities marked as [isTargeteable](#istargeteable) to know which entities will delete.

```ts
import { Neo4TS } from 'neo4ts';

//Deleting a person and all dogs own
const action: DBAction = Neo4TS.deleteMultiple({
  person: {
    id: 1, 
    isTargeteable: true, //<== don't forget to set it as the target
  },
  dog: {
    label: 'dog',
    isTargeteable: true, //<== don't forget to set it as the target
  },
  has: { from: 'person', to: 'dog', label: 'HAS' },
});
```

### Raw Cypher
Run cypher will execute a raw cypher provided by you. It can accept parameters as a second argument.

```ts
import { Neo4TS } from 'neo4ts';
const action: DBAction = Neo4TS.runCypher(
  'MATCH (dog:Dog {param1: $param1})',
  { param1: 12 }
);
```


## The Execute Function
Execute is a method from a DBAction that will trigger it's execution into the database. It returns a promise and when resolved it will returnthe right response [see more](#return-object).

```ts
Neo4TS.findAll({})
.execute().then(res => {
  console.log(res);
});
```

## The Get Query Function
Neo4TS has the feature to provide you with the query generated by your [GraphAbstraction](#graphabstraction-object) and your [DB Action](#database-actions).
The method will return a string, containing the cypher query.

```ts
import { Neo4TS } from 'neo4ts';

const query: string = Neo4TS.findAll({
  person: { label: 'person' }
  dog: { label: 'dog' },
  has: { from: 'person', label: 'HAS', to: 'dog' }
}).getQuery();

console.log(query);
```
query will be:
```txt
MATCH (person:person)-[has:HAS]->(dog:dog) return person, has, dog
```

## The Get Params For DB Use Function
you will notice that by using [getQuery( )](#the-get-query-function) or [getPrettyQuery( )](#the-get-pretty-query-function) when using filters or assign properties Neo4TS use parameters.
The method ```getParamsForDatabaseUse``` will return the params object that you can use to run the query.

```ts
const params = Neo4TS.findAll({...}).getParamsForDatabaseUse();
```

## The Get Pretty Query Function
Get pretty query will do almost the same as [getQuery](#the-get-query-function) but it will try to add break lines and tabs in order to be more readable for users.

```ts
import { Neo4TS } from 'neo4ts';

const query: string = Neo4TS.findAll({
  person: { label: 'person' },
  dog: { label: 'dog' }
}).getQuery();

console.log(query);
```
Query will be:
```txt
MATCH 
  (person:person),
  (dog:dog)
RETURN person, dog
```

## Override Return function
By default Neo4TS will build the return using and returning the entities, if you want to override this behaviour you can use ```overrideReturnAction```, this function accepts a callback that returns a string, this will be used to override what comes after the ```RETURN``` keyword.

```overrideReturnAction``` Will return the same DB Action so you can chain functions.

```ts
import { Neo4TS } from 'neo4ts';

//only want the person name
const res = await Neo4TS.findAll({
  person: { label: 'person' }
})
.overrideReturnAction(() => 'person.name as name');
.execute();
```

```overrideReturnAction``` callback also can receive the list of entities used to build the query.

```ts
import { Neo4TS } from 'neo4ts';

//only want the person name
const res = await Neo4TS.findAll({
  person: { label: 'person' }
})
.overrideReturnAction((entities) => `${entities[0].alias}.name as name`);
.execute();
```

**```overrideReturnAction``` Will also change the default behaviour of the [return object](#return-object-when-default-behaviour-modified)**

## Return object
Neo4TS will return for almost all DBActions the same format as defined in your [GraphAbstraction](#graphabstraction-object) but in an arraw, where every entry is a row result.

```ts
import { Neo4TS } from 'neo4ts';

//Find all people that have a dog
Neo4TS.findAll({
  person: { label: 'person' }
  dog: { label: 'dog' },
  has: { from: 'person', label: 'HAS', to: 'dog' }
}).execute().then(res => {
  console.log(res);
});
```
it will return an object like:
```ts
[
  { //the first row
    person: { label: 'person', properties: {...} }
    dog: { label: 'dog', properties: {...} },
    has: { from: 'person', label: 'HAS', to: 'dog', properties: {...} }
  },
  { //the second row
    person: { label: 'person', properties: {...} }
    dog: { label: 'dog', properties: {...} },
    has: { from: 'person', label: 'HAS', to: 'dog', properties: {...} }
  }
  ...
]

```
### Return Object when default behaviour modified
**If you modify the return phase it will [return](#override-return-function) a JSON like answer**

```ts
import { Neo4TS } from 'neo4ts';

//only want the person name
const res = await Neo4TS.findAll({
  person: { label: 'person' }
})
.overrideReturnAction(() => 'person.name as name'); //<--
.execute();
```

it will return an object like:

```ts
[
  { //the first row
    name: 'name1'
  },
  { //the second row
    name: 'name2'
  }
  ...
]

```

even if you return an entire entitie it will return a json containing only properties

```ts
import { Neo4TS } from 'neo4ts';

const res = await Neo4TS.findAll({
  person: { label: 'person' }
})
.overrideReturnAction(() => 'person'); //<--
.execute();
```

it will return an object like:

```ts
[
  { //the first row
    person: { name: 'name1' }
  },
  { //the second row
    person: { name: 'name1' }
  }
  ...
]

```