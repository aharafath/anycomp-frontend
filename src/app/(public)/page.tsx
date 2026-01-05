import Head from "next/head";

import Breadcrumbs from "@/components/public/globals/Breadcrumbs";
import SpecialistsGrid from "@/components/public/specialists/SpecialistsGrid";

const RegisterCompanyPage = () => {
  return (
    <main className="max-w-7xl mx-auto px-8 py-8">
      <Head>
        <title>AnyComp | Register a New Company</title>
      </Head>

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <SpecialistsGrid />
    </main>
  );
};

export default RegisterCompanyPage;
