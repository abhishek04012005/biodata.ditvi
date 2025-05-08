import './App.css';
import Main from './components/Main';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import BiodataDetails from './sturcutre/BioDataDetails/BiodataDetails';
import Footer from './components/Footer/Footer'
import AllBlogs from './RoutingPages/AllBlogs/AllBlogs';
import BlogDetail from './RoutingPages/BlogDetail/BlogDetail'
import PrivacyPolicy from './RoutingPages/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './RoutingPages/TermsOfService/TermsOfService';
import ScrollToTop from './sturcutre/ScrollToTop/ScrollToTop';
import AllBiodata from './sturcutre/AllBiodata/AllBiodata';
import WhyUs from './components/WhyUs/WhyUs';
import HowWeWork from './components/HowWeWorks/HowWeWork';
import Blog from './components/Blog/Blog';
import Contact from './components/ContactUs/ContactUs';
import Form from './components/Form/Form';
import { AdminProvider } from './utils/Admin/AdminContext/AdminContext';
import AdminRoute from './utils/Admin/AdminRoute';
import AdminLogin from './utils/Admin/AdminLogin/AdminLogin';
import AdminDashboard from './utils/Admin/AdminDashboard/AdminDashboard';
import UserRequestDetail from './utils/Admin/UserRequestDetail/UserRequestDetail';
import ProductionDashboard from './utils/Admin/ProductionDashboard/ProductionDashboard';
import ProductionRequestDetail from './utils/Admin/ProductionRequestDetail/ProductionRequestDetail';
import BiodataPreview from './utils/Admin/BiodataPreview/BiodataPreview';
import ThankYou from './components/ThankYou/ThankYou';
import UserFeedback from './components/UserFeedback/UserFeedback';
import CheckStatus from './components/CheckStatus/CheckStatus';
import PaymentSuccess from './components/Payment/PaymentSuccess';




function App() {

  return (
    <div className="App">


      <AdminProvider>
        <Router basename='/biodata.ditvi'>
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/biodata/:modelName" element={<BiodataDetails />} />
            <Route path="/blog" element={<AllBlogs />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />


            <Route path="/whyus" element={<WhyUs />} />
            <Route path="/how-we-work" element={<HowWeWork />} />
            <Route path="/biodata" element={<AllBiodata />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/form" element={<Form />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/feedback/:id" element={<UserFeedback />} />
            <Route path="/status/:id" element={<CheckStatus />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/payment-success/:paymentRequestId" element={<PaymentSuccess />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />

                </AdminRoute>
              }
            />


            <Route path="/request/:id" element={
              <AdminRoute>
                <UserRequestDetail />
              </AdminRoute>
            } />


            <Route path="/admin/production" element={
              <AdminRoute>
                <ProductionDashboard />
              </AdminRoute>
            } />

            <Route path="/production/request/:id" element={
              <AdminRoute>
                <ProductionRequestDetail />
              </AdminRoute>
            } />

            <Route path="/admin/production/preview/:id" element={
              <AdminRoute>
                <BiodataPreview />
              </AdminRoute>
            } />

<Route path="/status/:id" element={
   <AdminRoute>
   <CheckStatus />
 </AdminRoute>} />
            


          </Routes>


          <Footer />
        </Router>

      </AdminProvider>

    </div>
  );
}




export default App;
