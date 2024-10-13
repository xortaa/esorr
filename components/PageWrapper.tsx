const PageWrapper = ({ children }) => {
  return (
    <div className="flex page_wrapper_height">
      <div className="pt-5 lg:px-20 px-5 pb-20 flex-grow">{children}</div>
    </div>
  );
};

export default PageWrapper;
