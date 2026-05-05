import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Store from './pages/Store';
import Register from './pages/Register';

// ملاحظة: تأكد من إنشاء هذه الملفات في مجلد pages لاحقاً
const About = () => <div className="p-20 text-center font-bold">Page À Propos (En construction)</div>;
const Support = () => <div className="p-20 text-center font-bold text-[#00adef]">Équipe Support (En construction)</div>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* الصفحة الرئيسية: البحث الجغرافي ونظام SOS */}
          <Route path="/" element={<Home />} />
          
          {/* صفحة الخدمات: غسيل وميكانيك */}
          <Route path="/services" element={<Services />} />
          
          {/* متجر الإكسسوارات وقطع الغيار */}
          <Route path="/store" element={<Store />} />
          
          {/* صفحة التسجيل (Register) */}
          <Route path="/register" element={<Register />} />

          {/* المسارات الجديدة التي أضفناها للـ Navbar */}
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          
          {/* مسار احتياطي في حال أخطأ المستخدم في الرابط */}
          <Route path="*" element={<div className="p-20 text-center">404 - Page non trouvée</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;