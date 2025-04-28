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
import ForBride from './RoutingPages/ForBride/ForBride';
import ForGroom from './RoutingPages/ForGroom/ForGroom';
import WhyUs from './components/WhyUs/WhyUs';
import HowWeWork from './components/HowWeWorks/HowWeWork';
import Blog from './components/Blog/Blog';
import Contact from './components/ContactUs/ContactUs';

function App() {
  return (
    <div className="App">
      <Router basename='/'>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/biodata/:modelName" element={<BiodataDetails />} />
          <Route path="/blog" element={<AllBlogs />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/for-bride" element={<ForBride />} />
          <Route path="/for-groom" element={<ForGroom />} />

          <Route path="/whyus" element={<WhyUs />} />
          <Route path="/how-we-work" element={<HowWeWork />} />
          <Route path="/blog-section" element={<Blog/>} />
          <Route path="/contact-section" element={<Contact/>} />

        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
