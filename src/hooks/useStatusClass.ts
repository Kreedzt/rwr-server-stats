import { useCallback } from 'react';

export const useStatusClass = () => {
  const getServerStatClassName = useCallback((curr: number, total: number) => {
    if (curr !== total) return "text-red-500";
    if (curr === 0) return "text-gray-500";
    return "text-green-500";
  }, []);

  const getPlayerStatClassName = useCallback((curr: number, total: number) => {
    if (curr === total) return "text-red-500";
    if (curr === 0) return "text-gray-500";
    if (curr / total > 0.8) return "text-orange-500";
    return "text-green-500";
  }, []);

  return { getServerStatClassName, getPlayerStatClassName };
};
