import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { SwaAppModule } from './app/swa-app.module';
import { environment } from './environments/environment';

if (environment.production) {
  import('@angular/core').then(core => core.enableProdMode());
}

platformBrowserDynamic().bootstrapModule(SwaAppModule)
  .catch(err => console.error(err));
