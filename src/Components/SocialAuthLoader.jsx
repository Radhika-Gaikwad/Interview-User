const SocialAuthLoader = ({ children, text }) => {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl px-8 py-6 flex flex-col items-center gap-4 shadow-2xl">
        {children}
        <div className="w-6 h-6 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
};

export default SocialAuthLoader;
