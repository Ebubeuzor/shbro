import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Views/Home";
import ListingInfoMain from "./Views/ListingInfoMain";
import Settings from "./Views/Settings";
import Profile from "./Component/Settings/Profile";
import Payments from "./Component/Settings/Payments";
import Security from "./Component/Settings/Security";
import Chat from "./Component/Chat/Chat";
import AccountNotifications from "./Component/Settings/ProfileCardSettings/AccountNotifications";
import "./App.css";
import RequestBook from "./Views/RequestBook";
import AddGovvernmentId from "./Component/Settings/ProfileCardSettings/AddGovernmentId";
import Trip from "./Component/TripHistory/Trip";
import WishList from "./Views/WishList";
import WishlistsSet from "./Component/WishList/WishlistsSet";
import ManageListings from "./Component/Dashboard/ManageListings";
import UsersShow from "./Component/Dashboard/UsersShow";
import HostHomes from "./Component/Unboarding/HostHomes";
import Hosting from "./Component/Dashboard/Hosting";
import ConfirmDetails from "./Component/Dashboard/ConfirmDetails";
import Listings from "./Component/Dashboard/Listings";
import UserDetails from "./Component/UserDetails";
import Reservations from "./Component/Dashboard/Reservations";
import ScrollToTop from "./Component/ScrollToTop";
import HostAnalysis from "./Component/Dashboard/HostAnalysis";
import Schduler from "./Component/Dashboard/Schduler";
import ChatAndNotifcationTab from "./Views/ChatAndNotifcationTab";
import Registration from "./Views/Registration";
import EditHomepage from "./Component/AdminDashboard/EditHomepage";
import AdminAnalytical from "./Component/AdminDashboard/AdminAnalytical";
import GuestsListings from "./Component/AdminDashboard/GuestsListings";
import HostsListings from "./Component/AdminDashboard/HostsListings";
import PropertyList from "./Component/AdminDashboard/PropertyList";
import ApartmentListingApproval from "./Component/AdminDashboard/ApartmentListingApproval";
import CurrentBookingsList from "./Component/AdminDashboard/CurrentBookingList";
import UserVerificationPage from "./Component/AdminDashboard/UserVerificationPage";
import AdminRolesPage from "./Component/AdminDashboard/AdminRolesPage";
import AdminSupportPage from "./Component/AdminDashboard/AdminSupportPage";
import AnnouncementPage from "./Component/AdminDashboard/AnnouncementPage";
import RevenueMetricsPage from "./Component/AdminDashboard/RevenueMetricsPage";
import DisplayBookingsPaid from "./Component/AdminDashboard/DisplayBookingsPaid";
import FailedPayment from "./Component/AdminDashboard/FailedPayment";
import ReceivablePayable from "./Component/AdminDashboard/ReceivablePayable";
import BookingTable from "./Component/AdminDashboard/BookingTable";
import CompletedBooking from "./Component/AdminDashboard/CompletedBooking";
import ReviewList from "./Component/AdminDashboard/ReviewList";
import HostPayment from "./Component/Dashboard/HostPayment";
import PendingPayment from "./Component/AdminDashboard/PendingPayment";
import CanceledReservationTable from "./Component/AdminDashboard/CanceledReservationTable";
import { ContextProvider } from "./context/ContextProvider";
import Login from "./Component/SignupLogin/Login";
import Signup from "./Component/SignupLogin/SignUp";
import GoogleCallback from "./Views/GoogleCallbck";
import EditEmergencyNumber from "./Component/Settings/EditEmergencyNumber";
import ForgotPassword from "./Component/SignupLogin/ForgotPassword";
import SetNewPassword from "./Component/SignupLogin/SetNewPassword";
import Verify from "./Views/Verify";
import TransactionHistory from "./Component/Settings/TransactionHistory";
import TermsofService from "./Views/TermsofService";
import AboutUs from "./Views/AboutUs";
import ContactSupport from "./Views/ContactSupport";
import CancellationPolicy from "./Views/CancellationPolicy";
import FAQAccordion from "./Views/FAQAccordion";
import SupportAndHelp from "./Views/SupportAndHelp";
import PrivacyPolicy from "./Views/PrivacyPolicy";
import DamagesIncidentals from "./Views/DamagesIncidentals";
import UserVerificationDashboard from "./Component/AdminDashboard/UserVerificationDashboard";
import ServiceChargeSettings from "./Component/AdminDashboard/AdminNavigation/ServiceChargeSettings";
import DamageReportForm from "./Component/DamageReportForm";
import CityCard from "./Component/CityCard";
function App() {
  return (
    <Router>
        <ContextProvider>
        <Routes>
          <Route path="/:id?" element={<Home />} />
          <Route path="/ListingInfoMain" element={<ListingInfoMain />} />
          <Route path="/RequestBook" element={<RequestBook />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<Signup />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Payments" element={<Payments />} />
          <Route path="/Security" element={<Security />} />
          <Route path="/AddGovvernmentId" element={<AddGovvernmentId />} />
          <Route
            path="/AccountNotifications"
            element={<AccountNotifications />}
          />
          <Route path="/auth/google" element={<GoogleCallback />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/add-emergency-contact" element={<EditEmergencyNumber />} />
          <Route path="/Trip" element={<Trip />} />
          <Route path="/WishList" element={<WishList />} />
          <Route path="/WishlistsSet" element={<WishlistsSet />} />
          <Route path="/ManageListings" element={<ManageListings />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/Verify" element={<Verify />} />
          <Route path="/SetNewPassword" element={<SetNewPassword />} />
          <Route path="/UsersShow" element={<UsersShow />} />
          <Route path="/HostHomes" element={<HostHomes />} />
          <Route path="/Hosting" element={<Hosting />} />
          <Route path="/ConfirmDetails" element={<ConfirmDetails />} />
          <Route path="/Listings" element={<Listings />} />
          <Route path="/UserDetails" element={<UserDetails />} />
          <Route path="/Reservations" element={<Reservations />} />
          <Route path="/HostAnalysis" element={<HostAnalysis />} />
          <Route path="/Schduler" element={<Schduler />} />
          <Route path="/ChatAndNotifcationTab" element={<ChatAndNotifcationTab />} />
          <Route path="/Registration" element={<Registration/>}/>

        <Route path="/" element={<Home />} />
        <Route path="/ListingInfoMain" element={<ListingInfoMain />} />
        <Route path="/RequestBook" element={<RequestBook />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Payments" element={<Payments />} />
        <Route path="/Security" element={<Security />} />
        <Route path="/AddGovvernmentId" element={<AddGovvernmentId />} />
        <Route
          path="/AccountNotifications"
          element={<AccountNotifications />}
        />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/Trip" element={<Trip />} />
        <Route path="/WishList" element={<WishList />} />
        <Route path="/WishlistsSet" element={<WishlistsSet />} />
        <Route path="/ManageListings" element={<ManageListings />} />
        <Route path="/UsersShow" element={<UsersShow />} />
        <Route path="/HostHomes" element={<HostHomes />} />
        <Route path="/Hosting" element={<Hosting />} />
        <Route path="/ConfirmDetails" element={<ConfirmDetails />} />
        <Route path="/Listings" element={<Listings />} />
        <Route path="/UserDetails" element={<UserDetails />} />
        <Route path="/Reservations" element={<Reservations />} />
        <Route path="/HostAnalysis" element={<HostAnalysis />} />
        <Route path="/Schduler" element={<Schduler />} />

        <Route path="/Registration" element={<Registration />} />

        <Route
          path="/ChatAndNotifcationTab"
          element={<ChatAndNotifcationTab />}
        />
        <Route path="/EditHomepage" element={<EditHomepage />} />
        <Route path="/AdminAnalytical" element={<AdminAnalytical />} />




          <Route
            path="/ChatAndNotifcationTab"
            element={<ChatAndNotifcationTab />}
          />
          <Route path="/EditHomepage" element={<EditHomepage />} />
          <Route path="/AdminAnalytical" element={<AdminAnalytical />} />

          <Route path="/GuestsListings" element={<GuestsListings />} />

        <Route path="/HostsListings" element={<HostsListings />} />
        <Route path="/PropertyList" element={<PropertyList />} />
        <Route
          path="/ApartmentListingApproval"
          element={<ApartmentListingApproval />}
        />
        <Route path="/CurrentBookingsList" element={<CurrentBookingsList />} />
        <Route
          path="/UserVerificationPage"
          element={<UserVerificationPage />}
        />
        <Route path="/AdminRolesPage" element={<AdminRolesPage />} />
        <Route path="/AdminSupportPage" element={<AdminSupportPage />} />
        <Route path="/AnnouncementPage" element={<AnnouncementPage />} />
        <Route path="/RevenueMetricsPage" element={<RevenueMetricsPage />} />
        <Route path="/DisplayBookingsPaid" element={<DisplayBookingsPaid />} />
        <Route path="/FailedPayment" element={<FailedPayment />} />
        <Route path="/ReceivablePayable" element={<ReceivablePayable />} />
        <Route path="/BookingTable" element={<BookingTable />} />
        <Route path="/CompletedBooking" element={<CompletedBooking />} />
        <Route path="/ReviewList" element={<ReviewList />} />
        <Route path="/HostPayment" element={<HostPayment />} />
        <Route path="/PendingPayment" element={<PendingPayment />} />
        <Route
          path="/CanceledReservationTable"
          element={<CanceledReservationTable />}
        />
        <Route path="/TransactionHistory" element={<TransactionHistory />} />
        <Route path="/TermsofService" element={<TermsofService />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/ContactSupport" element={<ContactSupport />} />
        <Route path="/CancellationPolicy" element={<CancellationPolicy />} />
        <Route path="/FAQAccordion" element={<FAQAccordion />} />
        <Route path="/SupportAndHelp" element={<SupportAndHelp />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />

        <Route path="/DamagesAndIncidentals" element={<DamagesIncidentals />} />
        <Route
          path="/UserVerificationDashboard"
          element={<UserVerificationDashboard />}
        />
        <Route
          path="/ServiceChargeSettings"
          element={<ServiceChargeSettings />}
        />

        <Route path="/DamageReportForm" element={<DamageReportForm />} />
        <Route path="/CityCard" element={<CityCard />} />
      </Routes>
      
      </ContextProvider>
    </Router>
  );
}

export default App;
