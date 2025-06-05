import { lazy } from 'react';

const Home = lazy(() => import('./pages/main-page/home-component.tsx'));

export const routes = [
    { path: '/home', element: <Home /> },
];
