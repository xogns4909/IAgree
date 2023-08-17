import { useMediaQuery } from 'react-responsive';

export const Desktop = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const isDesktop = useMediaQuery({ minWidth: 769 });
  return isDesktop ? children : null;
};

export const Mobile = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return isMobile ? children : null;
};
export const DesktopHeader = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const isDesktopHeader = useMediaQuery({ minWidth: 1041 });
  return isDesktopHeader ? children : null;
};
export const DesktopRestaurantHeader = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element | null => {
  const isDesktopRestaurantHeader = useMediaQuery({ minWidth: 1451 });
  return isDesktopRestaurantHeader ? children : null;
};

export const MobileHeader = ({ children }: { children: JSX.Element }): JSX.Element | null => {
  const isMobileHeader = useMediaQuery({ minWidth: 769, maxWidth: 1040 });
  return isMobileHeader ? children : null;
};
export const MobileRestaurantHeader = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element | null => {
  const isMobileRestaurantHeader = useMediaQuery({ minWidth: 769, maxWidth: 1450 });
  return isMobileRestaurantHeader ? children : null;
};
