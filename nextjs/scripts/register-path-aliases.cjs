const Module = require("module");
const path = require("path");

const baseDir = path.join(process.cwd(), "dist-tests", "src");
const originalResolveFilename = Module._resolveFilename;
const originalLoad = Module._load;

Module._resolveFilename = function patchedResolve(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    const normalized = request.replace(/^@\//, "");
    const mapped = path.join(baseDir, normalized);
    return originalResolveFilename.call(this, mapped, parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

const stubs = {
  "next/navigation": {
    usePathname: () => "/",
    useRouter: () => ({
      push: () => {},
      replace: () => {},
      refresh: () => {},
    }),
    useSearchParams: () => new URLSearchParams(),
  },
};

Module._load = function patchedLoad(request, parent, isMain) {
  if (stubs[request]) {
    return stubs[request];
  }
  return originalLoad(request, parent, isMain);
};
