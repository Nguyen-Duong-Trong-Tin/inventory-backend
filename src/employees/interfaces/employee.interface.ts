import { Employee } from '../schema/employee.schema';

interface IEmployee extends Employee {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export default IEmployee;
