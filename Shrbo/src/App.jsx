import React, { useEffect } from "react";
import { ContextProvider } from "./ContextProvider/ContextProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Views/Home";
import ListingInfoMain from "./Views/ListingInfoMain";
import Settings from "./Views/Settings";
import Profile from "./Component/Settings/Profile";
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
import LogIn from "./Views/Login";
import SignUp from "./Views/SignUp";
import AuthGoogle from "./Views/AuthGoogle";
// import axios from "./Axios"
import HostHome from "./Component/Unboarding/HostHome";
import ForgotPassword from "./Component/SignupLogin/ForgotPassword";
import ReactivateAccount from "./Component/SignupLogin/ReactivateAccount";
import ReportDamage from "./Component/ReportDamages";
import EditHostHomes from "./Component/Unboarding/EditHostHomes";
import { BookingInfoData } from "./ContextProvider/BookingInfo";
import Protected from "./ProtectedRoutes";
import Public from "./PublicRoutes";
import PageNotFound from "./PageNotFound";
import PaymentsTab from "./Component/Settings/PaymentsTab";
import OtpPage from "./Component/Settings/OtpPage";
import AdminDamagePage from "./Component/AdminDashboard/AdminDamagePage";
import CommunicationCenter from "./Component/AdminDashboard/CommunicationCenter";
import Wallet from "./Component/Wallet/Wallet";
import AdminSecurityDeposit from "./Component/AdminDashboard/AdminSecurityDeposit";
import WalletRecords from "./Component/Wallet/WalletRecords";
import AdminUserReports from "./Component/AdminDashboard/AdminUserReports";
import SocialPage from "./Component/AdminDashboard/SocialPage";
function App() {

  return (
    <Router>
      <ContextProvider>
        <BookingInfoData>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ListingInfoMain/:id" element={<ListingInfoMain />} />
        <Route path="/RequestBook" element={<RequestBook />} />

      
          <Route element={<Protected />} >

              <Route path="/WalletRecords/:id" element={<WalletRecords/>} />
              <Route path="/payments" element={<Wallet />} />
              <Route path="/Settings" element={<Settings />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/UsersShow" element={<UsersShow />} />
              <Route path="/ManageCard" element={<PaymentsTab />} />
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
              <Route path="/WishlistsSet/:wishList/:id" element={<WishlistsSet />} />

              <Route path="/ManageListings" element={<ManageListings />} />
              <Route path="/HostHomes" element={<HostHomes />} />
              <Route path="/HostHome/:id" element={<HostHome />} />
              <Route path="/EditHostHomes/:id" element={<EditHostHomes />} />

              <Route path="/Hosting" element={<Hosting />} />
              <Route path="/ConfirmDetails" element={<ConfirmDetails />} />
              <Route path="/Listings" element={<Listings />} />
              <Route path="/UserDetails/:id" element={<UserDetails />} />
              <Route path="/Reservations" element={<Reservations />} />
              <Route path="/HostAnalysis" element={<HostAnalysis />} />
              <Route path="/Scheduler" element={<Schduler />} />



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
              <Route path="/AdminDamagePage" element={<AdminDamagePage />} />

              <Route
                path="/UserVerificationDashboard"
                element={<UserVerificationDashboard />}
              />
              <Route
                path="/ServiceChargeSettings"
                element={<ServiceChargeSettings />}
              />
              <Route path="/ReportDamage" element={<ReportDamage />} />

          </Route>

          <Route element={<Public />}>
            <Route path="/Login" element={<LogIn />} />
            <Route path="/Signup" element={<SignUp />} />
            <Route path="/auth/google" element={<AuthGoogle />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/ReactivateAccount" element={<ReactivateAccount />} />

          </Route>

          <Route path="/TermsofService" element={<TermsofService />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/ContactSupport" element={<ContactSupport />} />
          <Route path="/CancellationPolicy" element={<CancellationPolicy />} />
          <Route path="/FAQAccordion" element={<FAQAccordion />} />
          <Route path="/SupportAndHelp" element={<SupportAndHelp />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/DamagesAndIncidentals" element={<DamagesIncidentals />} />
          <Route path="/CommunicationCenter" element={<CommunicationCenter />} />
          <Route path="/AdminSecurityDeposit" element={<AdminSecurityDeposit />} />
          <Route path="/AdminUserReports" element={<AdminUserReports />} />
          <Route path="/SocialPage" element={<SocialPage />} />

          
          <Route path="*" element={<PageNotFound/>} />
          
        </Routes>
        </BookingInfoData>

      </ContextProvider>
    </Router>
  );
}

export default App;
