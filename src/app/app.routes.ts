import { Routes } from '@angular/router';
import { RateEstimator } from './pages/rate-estimator/rate-estimator';
import { Catalog } from './pages/catalog/catalog';

export const routes: Routes = [
{path: 'rate-estimator-xyz', component: RateEstimator},
{path:'', component: Catalog}
];
