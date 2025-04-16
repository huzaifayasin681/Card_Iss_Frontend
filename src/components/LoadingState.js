export default function LoadingState() {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-10 h-10 border-4 border-gray-200 border-l-primary rounded-full animate-spin mb-4"></div>
        <p>Loading...</p>
      </div>
    );
  }