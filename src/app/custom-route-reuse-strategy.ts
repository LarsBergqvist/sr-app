import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { AppRoutes } from './app-routes';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return (
      route.routeConfig.path === AppRoutes.Episodes || route.routeConfig.path === AppRoutes.Programs || route.routeConfig.path === AppRoutes.Channels
    );
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedRoutes.set(route.routeConfig.path, handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && !!this.storedRoutes.get(route.routeConfig.path);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return this.storedRoutes.get(route.routeConfig.path);
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
