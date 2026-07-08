import { Routes } from '@angular/router';
import { RateEstimator } from './pages/rate-estimator/rate-estimator';
import { Catalog } from './pages/catalog/catalog';
import { PlaceOrder } from './pages/place-order/place-order';
import { CreateOrder } from './pages/create-order/create-order';
import { B2cEstimator } from './pages/b2c-estimator/b2c-estimator';

export const routes: Routes = [
{path: 'rate-estimator-xyz', component: RateEstimator},
{path: 'b2c', component: B2cEstimator},
{path: 'place-order-xyz', component: PlaceOrder},
{path: 'create', component: CreateOrder},
{path: '', component: Catalog}
];
