// src/routes.js

import React from 'react';

const Login = React.lazy(() => import('../pages/login/Login'));
const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'));
const NotFound = React.lazy(() => import('../pages/NotFound'));
const Parameters = React.lazy(() => import('../pages/settings/Parameters/Parameter'));
const Holiday = React.lazy(() => import('../pages/settings/Holiday/Holiday'));
const Plans = React.lazy(() => import('../pages/settings/Plans/Plans'));
const AddPlan = React.lazy(() => import('../pages/settings/Plans/AddPlan'));
const UserManagement = React.lazy(() => import('../pages/adminUser/UserManagement'));
const AddAdmin = React.lazy(() => import('../pages/adminUser/AddAdmin'));
const Profile = React.lazy(() => import('../pages/profile/Profile'));
const Customer = React.lazy(() => import('../pages/customer/Listing'));
const ViewCustomer  = React.lazy(() => import('../pages/customer/ViewCustomer'));
const ViewCustomerPlans  = React.lazy(() => import('../pages/customerPlan/ViewPlan'));
const Billing = React.lazy(() => import('../pages/billings/Listing'));
const ViewBilling = React.lazy(() => import('../pages/billings/ViewBilling'));
const Order = React.lazy(() => import('../pages/orders/Listing'));
const ViewOrder = React.lazy(() => import('../pages/orders/view/View'));
const ViewOrderInput = React.lazy(() => import('../pages/orders/view/Input/InputPreview'));
const EmailTemplate = React.lazy(() => import('../pages/settings/Emails/Emails'));
const EditEmailTemplate = React.lazy(() => import('../pages/settings/Emails/EmailData'));
const Report = React.lazy(() => import('../pages/report/Report'));


const routes = [
  { path: '/', component: Login, exact: true, private:false },
  { path: '/dashboard', component: Dashboard, private: true },
  { path: '/parameters', component: Parameters, private: true },
  { path: '/holiday-list', component: Holiday, private: true },
  { path: '/plans', component: Plans, private: true },
  { path: '/add-plan', component: AddPlan, private: true },
  { path: '/edit-plan/:id', component: AddPlan, private: true },
  { path: '/user-management', component: UserManagement, private: true },
  { path: '/add-admin', component: AddAdmin, private: true },
  { path: '/edit-admin/:id', component: AddAdmin, private: true },
  { path: '/profile', component: Profile, private: true },
  { path: '/customers', component: Customer, private: true },
  { path: '/customer-detail/:id', component: ViewCustomer, private: true },
  { path: '/customer-plans', component: ViewCustomerPlans, private: true },
  { path: '/billings', component: Billing, private: true },
  { path: '/view-billings/:id', component: ViewBilling, private: true },
  { path: '/orders', component: Order, private: true },
  { path: '/view-orders/:id', component: ViewOrder, private: true },
  { path: '/view-order-inputs/:id', component: ViewOrderInput, private: true },
  { path: '/email-templates', component: EmailTemplate, private: true },
  { path: '/add-email-templates', component: EditEmailTemplate, private: true },
  { path: '/email-templates/:id', component: EditEmailTemplate, private: true },
  { path: '/report/:id', component: Report, private: true },
  { path: '*', component: NotFound }
];

export default routes;
