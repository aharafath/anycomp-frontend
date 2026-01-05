import { Home } from "@mui/icons-material";

const Breadcrumbs = () => {
  return (
    <>
      <nav className="flex items-center text-xs mb-4 space-x-2 text-primary">
        <Home fontSize="inherit" className="text-secondary" />
        <span>/</span>
        <span>Specialists</span>
        <span>/</span>
        <span>Register a New Company</span>
      </nav>

      <h2 className="text-3xl font-bold mb-1">Register a New Company</h2>
      <p className="text-gray-500 text-sm font-medium mb-8">
        Get Your Company Registered with Trusted Specialists
      </p>
    </>
  );
};

export default Breadcrumbs;
