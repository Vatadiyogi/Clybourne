import React from 'react';
// Front-end Component
const Login = React.lazy(() => import('../pages/login/Login'));
const Signup = React.lazy(() => import('../pages/signup/Signup'));
const VerificationLink = React.lazy(() => import('../pages/signup/Verify'));
const About = React.lazy(() => import('../pages/front/About'));
const Team = React.lazy(() => import('../pages/front/Team'));
const Pricing = React.lazy(() => import('../pages/front/plan/Pricing'));
const Contact = React.lazy(() => import('../pages/front/Contact'));
const Blog = React.lazy(() => import('../pages/front/Blog'));
const Home = React.lazy(() => import('../pages/front/Home'));
const HowItWorks = React.lazy(() => import('../pages/front/product/HowItWorks'));
const BlogDetails = React.lazy(() => import('../pages/front/BlogDetails'));
const Success = React.lazy(() => import('../pages/front/plan/checkout/Thanks'));
const Failure = React.lazy(() => import('../pages/front/plan/checkout/Failure'));


// Auth Component
const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'));
const Payment = React.lazy(() => import('../pages/payment/PaymentForm'));
const ValuationForm = React.lazy(() => import('../pages/orders/ValuationForm'));
const PreviewData = React.lazy(() => import('../pages/orders/preview-data/Preview'));
const OrderData = React.lazy(() => import('../pages/orders/listing/Listing'));
const MyPlan = React.lazy(() => import('../pages/plans/New'));
const UpgradePlan = React.lazy(() => import('../pages/plans/upgrade/Upgrade'));
const Profile = React.lazy(() => import('../pages/profile/Profile'));
const Form = React.lazy(() => import('../pages/orders/form/Modal/UploadForm/Upload'));
const Checkout = React.lazy(() => import('../pages/front/plan/checkout/Checkout'));
const AdvisorSummary = React.lazy(() => import('../pages/plans/upgrade/AdvisorSummary'));
const AdminLogin = React.lazy(() => import('../pages/login/AdminLogin'));
const NotAuthorised = React.lazy(() => import('../pages/NotAuthorised'));

const routes = [
  { path: '/', component: Home, exact: true, private: false },
  { path: '/about', component: About, exact: true, private: false },
  { path: '/team', component: Team, exact: true, private: false },
  { path: '/pricing', component: Pricing, exact: true, private: false },
  { path: '/contact', component: Contact, exact: true, private: false },
  { path: '/blog', component: Blog, exact: true, private: false },
  { path: '/blog-details', component: BlogDetails, exact: true, private: false },
  { path: '/how-it-works', component: HowItWorks, exact: true, private: false },
  { path: '/user-login', component: Login, exact: true, private: false },
  { path: '/user-signup', component: Signup, exact: true, private: false },
  { path: '/user-verification/:id', component: VerificationLink, exact: true, private: false},

  { path: '/dashboard', component: Dashboard, exact: true, private: true , allowedRoles: [ 'user']},
  { path: '/payment', component: Payment, exact: true, private: true, allowedRoles: [ 'user'] },
  { path: '/valuation-form/:orderId?', component: ValuationForm, exact: true, private: true, allowedRoles: ['admin', 'user']},
  { path: '/preview-data/:id', component: PreviewData, exact: true, private: true, allowedRoles: ['admin', 'user']},
  { path: '/orders', component: OrderData, exact: true, private: true, allowedRoles: [ 'user']},
  { path: '/my-plan', component: MyPlan, exact: true, private: true, allowedRoles: ['user']},
  { path: '/upgrade-plan', component: UpgradePlan, exact: true, private: true, allowedRoles: [ 'user']},
  { path: '/upgrade-summary', component: AdvisorSummary, exact: true, private: true, allowedRoles: [ 'user']},
  { path: '/profile', component: Profile, exact: true, private: true, allowedRoles: [ 'user']},
  { path: '/form', component: Form, exact: true, private: true, allowedRoles: [ 'user']},
  { path: '/checkout', component: Checkout, exact: true, private: true, allowedRoles: [ 'user']},
  { path: '/success-page', component: Success, exact: true, private: true, allowedRoles: [ 'user']},
  { path: '/payment-failed', component: Failure, exact: true, private: true, allowedRoles: [ 'user']},
  { path: '/admin-login', component: AdminLogin, exact: true, private: false},
  { path: '/not-authorised', component: NotAuthorised, exact: true, private: false},

];

export default routes;
