const Title = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-primary mb-1">{title}</h2>
      <p className="text-gray-400 text-sm font-medium">{description}</p>
    </section>
  );
};

export default Title;
