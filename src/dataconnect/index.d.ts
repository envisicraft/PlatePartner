import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateVisitLogData {
  visitLog_insert: VisitLog_Key;
}

export interface CreateVisitLogVariables {
  visitId: UUIDString;
  locationId: UUIDString;
  timestampIn: number;
  status: string;
  isGhost: boolean;
}

export interface DishItem_Key {
  id: UUIDString;
  __typename?: 'DishItem_Key';
}

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

export interface GetVisitLogByIdVariables {
  id: UUIDString;
}

export interface ListMyPlatesData {
  visitLogs: ({
    visitId: UUIDString;
    ratingScore?: number | null;
    location: {
      name: string;
    };
  })[];
}

export interface Location_Key {
  id: UUIDString;
  __typename?: 'Location_Key';
}

export interface MediaAsset_Key {
  id: UUIDString;
  __typename?: 'MediaAsset_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

export interface VisitLog_Key {
  id: UUIDString;
  __typename?: 'VisitLog_Key';
}

interface CreateVisitLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateVisitLogVariables): MutationRef<CreateVisitLogData, CreateVisitLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateVisitLogVariables): MutationRef<CreateVisitLogData, CreateVisitLogVariables>;
  operationName: string;
}
export const createVisitLogRef: CreateVisitLogRef;

export function createVisitLog(vars: CreateVisitLogVariables): MutationPromise<CreateVisitLogData, CreateVisitLogVariables>;
export function createVisitLog(dc: DataConnect, vars: CreateVisitLogVariables): MutationPromise<CreateVisitLogData, CreateVisitLogVariables>;

interface GetVisitLogByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetVisitLogByIdVariables): QueryRef<GetVisitLogByIdData, GetVisitLogByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetVisitLogByIdVariables): QueryRef<GetVisitLogByIdData, GetVisitLogByIdVariables>;
  operationName: string;
}
export const getVisitLogByIdRef: GetVisitLogByIdRef;

export function getVisitLogById(vars: GetVisitLogByIdVariables): QueryPromise<GetVisitLogByIdData, GetVisitLogByIdVariables>;
export function getVisitLogById(dc: DataConnect, vars: GetVisitLogByIdVariables): QueryPromise<GetVisitLogByIdData, GetVisitLogByIdVariables>;

interface ListMyPlatesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyPlatesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyPlatesData, undefined>;
  operationName: string;
}
export const listMyPlatesRef: ListMyPlatesRef;

export function listMyPlates(): QueryPromise<ListMyPlatesData, undefined>;
export function listMyPlates(dc: DataConnect): QueryPromise<ListMyPlatesData, undefined>;

