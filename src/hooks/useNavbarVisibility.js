import { useLocation } from 'react-router-dom';

export const useNavbarVisibility = () => {
  const location = useLocation();
  
  const hiddenRoutes = ['/'];
  
  return !hiddenRoutes.includes(location.pathname);
};