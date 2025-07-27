const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-[1920px] px-4 py-4 xl-py-20 mx-auto">{children}</div>
  );
};

export default Container;
