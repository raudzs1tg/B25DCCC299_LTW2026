import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const NoticeContext = createContext(null);

export const NoticeProvider = ({ children }) => {
  const [notice, setNotice] = useState(null);

  const showNotice = useCallback((text) => {
    setNotice({ text, id: Date.now() });
  }, []);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timerId = setTimeout(() => {
      setNotice(null);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [notice]);

  return (
    <NoticeContext.Provider value={showNotice}>
      {notice ? (
        <div role="status" className="notice-banner">
          {notice.text}
        </div>
      ) : null}
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const showNotice = useContext(NoticeContext);
  if (!showNotice) {
    throw new Error('useNotice phải dùng bên trong NoticeProvider');
  }
  return showNotice;
};