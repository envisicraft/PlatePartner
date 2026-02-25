# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createVisitLog, getVisitLogById, listMyPlates } from '@platepartner/dataconnect';


// Operation CreateVisitLog:  For variables, look at type CreateVisitLogVars in ../index.d.ts
const { data } = await CreateVisitLog(dataConnect, createVisitLogVars);

// Operation GetVisitLogById:  For variables, look at type GetVisitLogByIdVars in ../index.d.ts
const { data } = await GetVisitLogById(dataConnect, getVisitLogByIdVars);

// Operation ListMyPlates: 
const { data } = await ListMyPlates(dataConnect);


```