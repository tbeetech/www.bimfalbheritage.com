// Admin.jsx
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AdminDashboardPane from './admin/AdminDashboardPane';
import AdminPostsPane from './admin/AdminPostsPane';
import AdminEditorPane from './admin/AdminEditorPane';

const Admin = () => {
    return (
        <Switch>
            <Route path='/admin/edit/:id' component={AdminEditorPane} />
            <Route path='/admin' component={AdminDashboardPane} />
        </Switch>
    );
};

export default Admin;