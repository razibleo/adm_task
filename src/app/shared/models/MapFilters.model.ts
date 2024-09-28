import { IFirstAdminBoudary } from './FirstAdminBoundary.model';
import { ISecondAdminBoundary } from './SecondAdminBoundary.model';
import { IThirdAdminBoundary } from './ThridAdminBoundary.model';

export interface IMapFilters {
  firstAdminBoundarires?: IFirstAdminBoudary[];
  secondAdminBoundarires?: ISecondAdminBoundary[];
  thirdAdminBoundarires?: IThirdAdminBoundary[];
}
