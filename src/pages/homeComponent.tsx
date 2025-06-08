// ./features/main-page/home/home-component.js
import Sidebar from '@/layout/sideBar/sideBar';
import React, { Component } from 'react';
import { WorkspaceArea } from './workspaceArea';

export default class Home extends Component {
    render() {
        return (
            <div className="flex h-screen w-screen overflow-hidden">
                <Sidebar />
                <WorkspaceArea />
            </div>
        );
    }
}
