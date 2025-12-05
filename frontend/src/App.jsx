import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import RfpList from "./pages/RfpList";
import RfpCreate from "./pages/RfpCreate";
import Vendors from "./pages/Vendors";
import RfpDetail from "./pages/RfpDetail";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<RfpList />} />
        <Route path="/create" element={<RfpCreate />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/rfp/:id" element={<RfpDetail />} />
      </Routes>
    </Layout>
  );
}
