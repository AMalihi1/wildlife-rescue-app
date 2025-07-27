import { UserType } from "../types/enums";

export interface User {
  id: string;
  fullName: string;
  email?: string;
  type?: UserType; 
  phoneNumber: string;
  city:string
  createdAt: Date;
  updatedAt: Date;
}

