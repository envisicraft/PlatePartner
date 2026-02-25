import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'platepartner-connector',
  service: 'platepartner',
  location: 'us-east4'
};

export const createVisitLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateVisitLog', inputVars);
}
createVisitLogRef.operationName = 'CreateVisitLog';

export function createVisitLog(dcOrVars, vars) {
  return executeMutation(createVisitLogRef(dcOrVars, vars));
}

export const getVisitLogByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVisitLogById', inputVars);
}
getVisitLogByIdRef.operationName = 'GetVisitLogById';

export function getVisitLogById(dcOrVars, vars) {
  return executeQuery(getVisitLogByIdRef(dcOrVars, vars));
}

export const listMyPlatesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyPlates');
}
listMyPlatesRef.operationName = 'ListMyPlates';

export function listMyPlates(dc) {
  return executeQuery(listMyPlatesRef(dc));
}

