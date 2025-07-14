import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react'; // Or any icon lib you like

export default function ConnectionToast() {
const [showToast, setShowToast] = useState(true);

useEffect(() => {
        const timer = setTimeout(() => 
            setShowToast(false), 3000);
        return () => clearTimeout(timer);
    
});
useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slide-in {
            0% {
                opacity: 0;
                transform: translateY(40px) scale(0.95);
            }
            60% {
                opacity: 1;
                transform: translateY(-8px) scale(1.03);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        .animate-slide-in {
            animation: slide-in 0.7s cubic-bezier(.4,2,.3,1) both;
        }
    `;
    document.head.appendChild(style);
    return () => {
        document.head.removeChild(style);
    };
}, []);
  return (
    <>
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex max-w-sm items-center gap-4 rounded-xl bg-red-50 border border-red-200 p-4 shadow-lg animate-slide-in">
          <WifiOff className="h-6 w-6 text-red-500" />
          <div>
            <p className="font-semibold text-red-700">No Internet Connection</p>
            <p className="text-sm text-red-600">Check your network and try again.</p>
          </div>
        </div>
      )}
    </>
  );
}
