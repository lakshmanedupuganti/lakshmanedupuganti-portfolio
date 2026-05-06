/** @type {import('next').NextConfig} */

const isMainModuleScssRule = (rule) => {
  let testArr = [];
  if (Array.isArray(rule.test)) {
    testArr = rule.test;
  } else if (rule.test instanceof RegExp) {
    testArr = [rule.test];
  }

  if (!testArr.some((t) => /scss/gi.test(String(t)))) return false;

  if (Array.isArray(rule.use)) {
    return rule.use.some((u) => u.options?.modules);
  }
  return false;
};

const findMainModuleScssRulesIndexes = (arr) => {
  const stack = [];
  for (let i = 0; i < arr.length; i++) {
    if (isMainModuleScssRule(arr[i])) {
      stack.push(i);
    }
  }
  return stack;
};

const cloneMainModuleScssRule = (rule) => {
  const newRule = { ...rule };
  if (Array.isArray(newRule.use)) {
    newRule.use = newRule.use.map((u) => {
      if (!u || typeof u !== "object") return u;
      const newU = { ...u };
      if (newU.options && typeof newU.options === "object") {
        newU.options = { ...newU.options };

        if (newU.options.modules) {
          newU.options.modules = false;
        }
      }

      return newU;
    });
  }
  return newRule;
};

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,

  // create CSS processing rules for xxxx.dynamic.module.scss files, so that the class name deocarations are removed and third party CSS files can be included in them
  webpack(cfg, { buildId, dev, isServer, defaultLoaders, webpack }) {
    const nextCssLoaders = cfg.module.rules.find((rule) =>
      Array.isArray(rule.oneOf)
    );

    if (nextCssLoaders) {
      const ruleArr = nextCssLoaders.oneOf;
      const ruleIdxs = findMainModuleScssRulesIndexes(ruleArr);

      const newRules = ruleIdxs.map((idx) =>
        cloneMainModuleScssRule(ruleArr[idx])
      );

      // exclude xxxx.dynamic.module.scss files from the default module.scss rules
      ruleIdxs.forEach((idx) => {
        ruleArr[idx].test = /(?<!\.dynamic)\.module\.(scss|sass)$/;
      });

      newRules.forEach((r) => {
        r.test = /\.dynamic\.module\.(scss|sass)$/;
        ruleArr.splice(ruleIdxs[0] - 1, 0, r);
      });
    }

    return cfg;
  },
  assetPrefix: "/provider",
  rewrites: async () => [
    {
      source: "/sitemap.xml",
      destination: "/api/sitemap",
    },
    {
      source: "/robots.txt",
      destination: "/api/robots",
    },
    {
      source: "/provider/sitemap.xml",
      destination: "/api/sitemap",
    },
    {
      source: "/provider/robots.txt",
      destination: "/api/robots",
    },
    {
      source: "/provider/api/:path*",
      destination: "/api/:path*",
    },
    {
      source: "/provider/_next/:path*",
      destination: "/_next/:path*",
    }
  ],
};

module.exports = nextConfig;
