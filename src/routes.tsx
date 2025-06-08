// routes.js or routes.jsx
import { lazy } from 'react';

const Home = lazy(() => import('./pages/homeComponent'));

export const routes = [
    { path: '/', element: <Home /> },
];

