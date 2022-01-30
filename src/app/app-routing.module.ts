import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'game/1',
    loadChildren: () => import('./home/home-1.module').then( m => m.HomePageModule1)
  },
  {
    path: 'game/2',
    loadChildren: () => import('./home/home-2.module').then( m => m.HomePageModule2)
  },
  {
    path: 'game/3',
    loadChildren: () => import('./home/home-3.module').then( m => m.HomePageModule3)
  },
  {
    path: 'game/4',
    loadChildren: () => import('./home/home-4.module').then( m => m.HomePageModule4)
  },
  {
    path: 'game/5',
    loadChildren: () => import('./home/home-5.module').then( m => m.HomePageModule5)
  },
  {
    path: 'game/6',
    loadChildren: () => import('./home/home-6.module').then( m => m.HomePageModule6)
  },
  {
    path: '',
    redirectTo: 'lobby',
    pathMatch: 'full'
  },
  {
    path: 'lobby',
    loadChildren: () => import('./lobby/lobby.module').then( m => m.LobbyPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
