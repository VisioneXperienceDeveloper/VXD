const useRouter = () => ({
  push: (href) => {},
  replace: (href) => {},
  prefetch: (href) => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
});

const usePathname = () => '';
const useSearchParams = () => new URLSearchParams();
const redirect = (url) => {};
const notFound = () => {};

module.exports = {
  useRouter,
  usePathname,
  useSearchParams,
  redirect,
  notFound,
};
