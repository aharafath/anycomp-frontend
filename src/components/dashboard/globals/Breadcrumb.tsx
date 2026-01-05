const Breadcrumb = ({ title }: { title: string }) => {
  return (
    <main className="mb-2 py-2 px-5">
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
        Dashboard
      </p>
      <h1 className="text-3xl font-black text-primary tracking-tight">
        {title}
      </h1>
    </main>
  );
};

export default Breadcrumb;
