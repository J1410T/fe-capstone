import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { Loading } from "@/components/common/loading";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  startLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Hook để truy cập LoadingContext từ bất kỳ component nào
 */
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

type LoadingProviderProps = {
  children: ReactNode;
};

/**
 * Provider quản lý trạng thái loading của ứng dụng
 * Hiển thị màn hình loading khi:
 * 1. Reload trang - ngay lập tức
 * 2. Chuyển trang - đảm bảo hiển thị ít nhất 2.5s
 */
export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  // Khởi tạo isLoading = true để hiển thị loading ngay khi reload trang
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const location = useLocation();
  const navigationType = useNavigationType();

  // Hàm này có thể được gọi từ bất kỳ component con nào để kích hoạt loading
  const startLoading = () => {
    setIsLoading(true);
    setContent(null);
  };

  // Phản ứng với thay đổi đường dẫn hoặc kiểu điều hướng
  useEffect(() => {
    // 1. Bắt đầu loading khi URL hoặc navigationType thay đổi
    startLoading();

    // 2. Chuẩn bị nội dung trong memory nhưng chưa hiển thị
    const prepareContentTimer = setTimeout(() => {
      setContent(children);
    }, 100);

    // 3. Chờ 1.5s rồi mới tắt loading và hiển thị nội dung trang
    const hideLoadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(prepareContentTimer);
      clearTimeout(hideLoadingTimer);
    };
  }, [location.pathname, navigationType, children]);

  // Kiểm tra trạng thái loading khi component này được mount để đảm bảo loading hiển thị ngay lập tức
  useEffect(() => {
    // Đảm bảo loading hiển thị ngay khi component này mount (reload trang)
    startLoading();

    // Giả lập việc chuẩn bị nội dung để có thể hiển thị sau khi loading
    const initialContentTimer = setTimeout(() => {
      setContent(children);
    }, 100);

    // Giữ loading trong 1.5s để đảm bảo hiển thị đủ hiệu ứng
    const initialLoadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(initialContentTimer);
      clearTimeout(initialLoadingTimer);
    };
  }, []); // Chỉ chạy khi component mount lần đầu tiên

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, startLoading }}>
      {/* Hiển thị loading khi isLoading = true */}
      {isLoading && <Loading minDisplayTime={1500} />}

      {/* Chỉ hiển thị nội dung khi loading đã hoàn tất */}
      {!isLoading && content ? content : null}
    </LoadingContext.Provider>
  );
};
