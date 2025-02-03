const LoadingPage = () => {
  return (
    <div className="flex justify-center flex-col gap-5 items-center h-screen w-screen">
      <div className="loader"/>
      <span className="uppercase text-[#2a9d8f] font-bold text-sm tracking-widest">loading...</span>
    </div>
  );
}
 
export default LoadingPage;