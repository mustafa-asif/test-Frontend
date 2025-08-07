import { useStoreState } from "easy-peasy";

export const useAccessRestrictions = () => {
  const user = useStoreState((state) => state.auth.user);

  const page_access = user.access_restrictions?.pages;
  function canAccessPage(page) {
    if (page_access?.length < 1) return true;
    else return !page_access?.includes(page);
  }

  return { canAccessPage };
};
