
export enum FuelStatus {
  AVAILABLE = 'AVAILABLE',
  LOW = 'LOW',
  UNAVAILABLE = 'UNAVAILABLE'
}

export interface FuelStation {
  id: string;
  name: string;
  neighborhood: string;
  gasolineStatus: FuelStatus;
  dieselStatus: FuelStatus;
  lastUpdated: string;
  contact: string;
}

export interface BusinessOwner {
  fullName: string;
  phone: string;
  email: string;
  nif: string;
  biNumber: string;
  neighborhood: string;
  companyName: string;
  documents?: {
    biFile: string;
    nifFile: string;
    legalFile: string;
  };
}

export type AppView = 'user' | 'business' | 'register' | 'pending' | 'login';
