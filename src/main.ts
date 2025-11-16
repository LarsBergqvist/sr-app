// PrimeUIX / PrimeNG v20 style entrypoints.
// Importing these ensures PrimeUIX style modules are included by the bundler.
// We import both the styled runtime and the styles package. Depending on the
// exact PrimeUIX version you may prefer more specific subpath imports (e.g.
// '@primeuix/styles/base' or a theme/preset entrypoint). If you want a
// different theme or to include fewer style modules, I can adjust these.
import '@primeuix/styled';
// Use the package entrypoint so node resolution & package exports are honored.
import '@primeuix/styles';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
