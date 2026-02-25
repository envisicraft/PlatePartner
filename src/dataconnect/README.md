# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `platepartner-connector`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetVisitLogById*](#getvisitlogbyid)
  - [*ListMyPlates*](#listmyplates)
- [**Mutations**](#mutations)
  - [*CreateVisitLog*](#createvisitlog)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `platepartner-connector`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@platepartner/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@platepartner/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@platepartner/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `platepartner-connector` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetVisitLogById
You can execute the `GetVisitLogById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getVisitLogById(vars: GetVisitLogByIdVariables): QueryPromise<GetVisitLogByIdData, GetVisitLogByIdVariables>;

interface GetVisitLogByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVisitLogByIdVariables): QueryRef<GetVisitLogByIdData, GetVisitLogByIdVariables>;
}
export const getVisitLogByIdRef: GetVisitLogByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getVisitLogById(dc: DataConnect, vars: GetVisitLogByIdVariables): QueryPromise<GetVisitLogByIdData, GetVisitLogByIdVariables>;

interface GetVisitLogByIdRef {
  ...
  (dc: DataConnect, vars: GetVisitLogByIdVariables): QueryRef<GetVisitLogByIdData, GetVisitLogByIdVariables>;
}
export const getVisitLogByIdRef: GetVisitLogByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getVisitLogByIdRef:
```typescript
const name = getVisitLogByIdRef.operationName;
console.log(name);
```

### Variables
The `GetVisitLogById` query requires an argument of type `GetVisitLogByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetVisitLogByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetVisitLogById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetVisitLogByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetVisitLogByIdData {
  visitLog?: {
    visitId: UUIDString;
    ratingScore?: number | null;
    futureMeTip?: string | null;
    location: {
      name: string;
      address?: string | null;
    };
  };
}
```
### Using `GetVisitLogById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getVisitLogById, GetVisitLogByIdVariables } from '@platepartner/dataconnect';

// The `GetVisitLogById` query requires an argument of type `GetVisitLogByIdVariables`:
const getVisitLogByIdVars: GetVisitLogByIdVariables = {
  id: ..., 
};

// Call the `getVisitLogById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getVisitLogById(getVisitLogByIdVars);
// Variables can be defined inline as well.
const { data } = await getVisitLogById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getVisitLogById(dataConnect, getVisitLogByIdVars);

console.log(data.visitLog);

// Or, you can use the `Promise` API.
getVisitLogById(getVisitLogByIdVars).then((response) => {
  const data = response.data;
  console.log(data.visitLog);
});
```

### Using `GetVisitLogById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getVisitLogByIdRef, GetVisitLogByIdVariables } from '@platepartner/dataconnect';

// The `GetVisitLogById` query requires an argument of type `GetVisitLogByIdVariables`:
const getVisitLogByIdVars: GetVisitLogByIdVariables = {
  id: ..., 
};

// Call the `getVisitLogByIdRef()` function to get a reference to the query.
const ref = getVisitLogByIdRef(getVisitLogByIdVars);
// Variables can be defined inline as well.
const ref = getVisitLogByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getVisitLogByIdRef(dataConnect, getVisitLogByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.visitLog);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.visitLog);
});
```

## ListMyPlates
You can execute the `ListMyPlates` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listMyPlates(): QueryPromise<ListMyPlatesData, undefined>;

interface ListMyPlatesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyPlatesData, undefined>;
}
export const listMyPlatesRef: ListMyPlatesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyPlates(dc: DataConnect): QueryPromise<ListMyPlatesData, undefined>;

interface ListMyPlatesRef {
  ...
  (dc: DataConnect): QueryRef<ListMyPlatesData, undefined>;
}
export const listMyPlatesRef: ListMyPlatesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyPlatesRef:
```typescript
const name = listMyPlatesRef.operationName;
console.log(name);
```

### Variables
The `ListMyPlates` query has no variables.
### Return Type
Recall that executing the `ListMyPlates` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyPlatesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyPlatesData {
  visitLogs: ({
    visitId: UUIDString;
    ratingScore?: number | null;
    location: {
      name: string;
    };
  })[];
}
```
### Using `ListMyPlates`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyPlates } from '@platepartner/dataconnect';


// Call the `listMyPlates()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyPlates();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyPlates(dataConnect);

console.log(data.visitLogs);

// Or, you can use the `Promise` API.
listMyPlates().then((response) => {
  const data = response.data;
  console.log(data.visitLogs);
});
```

### Using `ListMyPlates`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyPlatesRef } from '@platepartner/dataconnect';


// Call the `listMyPlatesRef()` function to get a reference to the query.
const ref = listMyPlatesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyPlatesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.visitLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.visitLogs);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `platepartner-connector` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateVisitLog
You can execute the `CreateVisitLog` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createVisitLog(vars: CreateVisitLogVariables): MutationPromise<CreateVisitLogData, CreateVisitLogVariables>;

interface CreateVisitLogRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVisitLogVariables): MutationRef<CreateVisitLogData, CreateVisitLogVariables>;
}
export const createVisitLogRef: CreateVisitLogRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createVisitLog(dc: DataConnect, vars: CreateVisitLogVariables): MutationPromise<CreateVisitLogData, CreateVisitLogVariables>;

interface CreateVisitLogRef {
  ...
  (dc: DataConnect, vars: CreateVisitLogVariables): MutationRef<CreateVisitLogData, CreateVisitLogVariables>;
}
export const createVisitLogRef: CreateVisitLogRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createVisitLogRef:
```typescript
const name = createVisitLogRef.operationName;
console.log(name);
```

### Variables
The `CreateVisitLog` mutation requires an argument of type `CreateVisitLogVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateVisitLogVariables {
  visitId: UUIDString;
  locationId: UUIDString;
  timestampIn: number;
  status: string;
  isGhost: boolean;
}
```
### Return Type
Recall that executing the `CreateVisitLog` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateVisitLogData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateVisitLogData {
  visitLog_insert: VisitLog_Key;
}
```
### Using `CreateVisitLog`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createVisitLog, CreateVisitLogVariables } from '@platepartner/dataconnect';

// The `CreateVisitLog` mutation requires an argument of type `CreateVisitLogVariables`:
const createVisitLogVars: CreateVisitLogVariables = {
  visitId: ..., 
  locationId: ..., 
  timestampIn: ..., 
  status: ..., 
  isGhost: ..., 
};

// Call the `createVisitLog()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createVisitLog(createVisitLogVars);
// Variables can be defined inline as well.
const { data } = await createVisitLog({ visitId: ..., locationId: ..., timestampIn: ..., status: ..., isGhost: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createVisitLog(dataConnect, createVisitLogVars);

console.log(data.visitLog_insert);

// Or, you can use the `Promise` API.
createVisitLog(createVisitLogVars).then((response) => {
  const data = response.data;
  console.log(data.visitLog_insert);
});
```

### Using `CreateVisitLog`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createVisitLogRef, CreateVisitLogVariables } from '@platepartner/dataconnect';

// The `CreateVisitLog` mutation requires an argument of type `CreateVisitLogVariables`:
const createVisitLogVars: CreateVisitLogVariables = {
  visitId: ..., 
  locationId: ..., 
  timestampIn: ..., 
  status: ..., 
  isGhost: ..., 
};

// Call the `createVisitLogRef()` function to get a reference to the mutation.
const ref = createVisitLogRef(createVisitLogVars);
// Variables can be defined inline as well.
const ref = createVisitLogRef({ visitId: ..., locationId: ..., timestampIn: ..., status: ..., isGhost: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createVisitLogRef(dataConnect, createVisitLogVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.visitLog_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.visitLog_insert);
});
```

