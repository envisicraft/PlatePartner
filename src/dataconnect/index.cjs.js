const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'platepartner-connector',
  service: 'platepartner',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createVisitLogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateVisitLog', inputVars);
}
createVisitLogRef.operationName = 'CreateVisitLog';
exports.createVisitLogRef = createVisitLogRef;

exports.createVisitLog = function createVisitLog(dcOrVars, vars) {
  return executeMutation(createVisitLogRef(dcOrVars, vars));
};

const getVisitLogByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetVisitLogById', inputVars);
}
getVisitLogByIdRef.operationName = 'GetVisitLogById';
exports.getVisitLogByIdRef = getVisitLogByIdRef;

exports.getVisitLogById = function getVisitLogById(dcOrVars, vars) {
  return executeQuery(getVisitLogByIdRef(dcOrVars, vars));
};

const listMyPlatesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyPlates');
}
listMyPlatesRef.operationName = 'ListMyPlates';
exports.listMyPlatesRef = listMyPlatesRef;

exports.listMyPlates = function listMyPlates(dc) {
  return executeQuery(listMyPlatesRef(dc));
};
