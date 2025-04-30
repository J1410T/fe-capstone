import { useEffect, useState } from 'react';
import vnFlag from '../../assets/images/vn-flag-full.gif';
import FNLFlag from '../../assets/images/FNL_Flag.svg';

type LoadingProps = {
  /** Thời gian hiển thị tối thiểu (ms), mặc định là 2000ms */
  minDisplayTime?: number;
};

/**
 * Component hiển thị màn hình loading với hiệu ứng 3 chấm, hình ảnh cờ Việt Nam và hiệu ứng văn bản
 * Sử dụng màu sắc chủ đạo của dự án FPT AI Admission
 */
export const Loading = ({ minDisplayTime = 2000 }: LoadingProps = {}) => {
  const [show, setShow] = useState(true);
  
  // Đảm bảo hiệu ứng loading chạy ít nhất theo thời gian cấu hình
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, minDisplayTime);
    
    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  // Nếu !show thì component này sẽ không hiển thị gì
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Hình ảnh cờ Việt Nam - Đã làm lớn hơn */}
        <div className="flag-container">
          <img src={vnFlag} alt="Cờ Việt Nam" className="w-48 md:w-64 h-auto mb-2 flag-animation" />
        </div>
        
        {/* Hiệu ứng 3 chấm với màu gradient */}
        <div className="flex space-x-5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 dot-pulse" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 dot-pulse animation-delay-300" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 dot-pulse animation-delay-600" />
        </div>
        
        {/* Dòng chữ chào mừng với hiệu ứng - Đã làm to hơn và thêm hiệu ứng */}
        <p className="mt-4 text-xl md:text-2xl font-bold text-center text-gradient">
          Chào Mừng Đại lễ 30/4
        </p>
        <p className="text-lg md:text-xl font-semibold text-center text-gray-800 text-reveal">
          Giải phóng <span className="text-blue-500">miền Nam</span>, <span className="text-amber-400">thống nhất</span> <span className="text-red-500">Đất Nước</span> <img src={FNLFlag} alt="Cờ FNL" className="w-12 h-auto inline-block" />
        </p>
      </div>
      
      <style>{`
        /* Hiệu ứng pulse cho 3 chấm */
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.8; }
        }
        
        .dot-pulse {
          animation: pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        /* Hiệu ứng cho cờ */
        @keyframes flagWave {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
        
        .flag-animation {
          animation: flagWave 3s ease-in-out infinite;
          filter: drop-shadow(0 8px 15px rgba(0,0,0,0.1));
        }
        
        /* Hiệu ứng gradient cho text */
        .text-gradient {
          background: linear-gradient(90deg, #f59e0b, #f97316, #f59e0b);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% auto;
          animation: textShine 3s linear infinite;
        }
        
        @keyframes textShine {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        
        /* Hiệu ứng hiện dần từ trái sang phải */
        .text-reveal {
          animation: revealText 1.5s ease-out forwards;
          overflow: hidden;
        }
        
        @keyframes revealText {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

/**
 * Component giúp hiển thị loading khi chuyển trang hoặc mới load trang
 * Sử dụng chung với Outlet của React Router để đảm bảo hiển thị loading trước khi render trang đích
 */
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<React.ReactNode | null>(null);

  // Xử lý hiệu ứng chuyển trang và loading
  useEffect(() => {
    // Luôn hiển thị loading đầu tiên
    setIsLoading(true);
    setContent(null);

    // Lưu nội dung vào state nhưng chưa hiển thị
    // Điều này đảm bảo rằng nội dung được chuẩn bị sẵn sàng nhưng chưa render
    const prepareContent = setTimeout(() => {
      setContent(children);
    }, 100);

    // 2 giây sau mới ẩn loading và hiển thị nội dung
    const hideLoading = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      clearTimeout(prepareContent);
      clearTimeout(hideLoading);
    };
  }, [children]); // Khi children thay đổi (chuyển trang) sẽ kích hoạt hiệu ứng này

  return (
    <>
      {isLoading && <Loading minDisplayTime={2500} />}
      {/* Nội dung trang được hiển thị sau khi loading hoàn tất */}
      {!isLoading && content ? content : null}
    </>
  );
};
