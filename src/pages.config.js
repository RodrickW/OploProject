/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AboutOplo from './pages/AboutOplo';
import Affiliates from './pages/Affiliates';
import Alignment from './pages/Alignment';
import Careers from './pages/Careers';
import CaseStudies from './pages/CaseStudies';
import Contact from './pages/Contact';
import CustomerSuccess from './pages/CustomerSuccess';
import Dashboard from './pages/Dashboard';
import Devs from './pages/Devs';
import Help from './pages/Help';
import Home from './pages/Home';
import Insights from './pages/Insights';
import IntegrationsOplo from './pages/IntegrationsOplo';
import KnowledgeBase from './pages/KnowledgeBase';
import Market from './pages/Market';
import Notifications from './pages/Notifications';
import Onboarding from './pages/Onboarding';
import Operations from './pages/Operations';
import OploChat from './pages/OploChat';
import Partners from './pages/Partners';
import PricingPage from './pages/PricingPage';
import Product from './pages/Product';
import Profile from './pages/Profile';
import QuoteQualification from './pages/QuoteQualification';
import RestaurantDetail from './pages/RestaurantDetail';
import Restaurants from './pages/Restaurants';
import Sales from './pages/Sales';
import Search from './pages/Search';
import Settings from './pages/Settings';
import Team from './pages/Team';
import TeamAsAService from './pages/TeamAsAService';
import University from './pages/University';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AboutOplo": AboutOplo,
    "Affiliates": Affiliates,
    "Alignment": Alignment,
    "Careers": Careers,
    "CaseStudies": CaseStudies,
    "Contact": Contact,
    "CustomerSuccess": CustomerSuccess,
    "Dashboard": Dashboard,
    "Devs": Devs,
    "Help": Help,
    "Home": Home,
    "Insights": Insights,
    "IntegrationsOplo": IntegrationsOplo,
    "KnowledgeBase": KnowledgeBase,
    "Market": Market,
    "Notifications": Notifications,
    "Onboarding": Onboarding,
    "Operations": Operations,
    "OploChat": OploChat,
    "Partners": Partners,
    "PricingPage": PricingPage,
    "Product": Product,
    "Profile": Profile,
    "QuoteQualification": QuoteQualification,
    "RestaurantDetail": RestaurantDetail,
    "Restaurants": Restaurants,
    "Sales": Sales,
    "Search": Search,
    "Settings": Settings,
    "Team": Team,
    "TeamAsAService": TeamAsAService,
    "University": University,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};