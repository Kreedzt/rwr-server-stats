import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const env = loadEnv(config.mode, process.cwd(), "") as {
    SERVER_MATCH_REGEX: string;
    MESSAGE_LIST: string;
    HTML_TITLE: string;
    SERVER_MATCH_REALM?: string;
    ROUTE_PREFIX?: string;
  };

  let buildBase = '/';

  if (env.ROUTE_PREFIX) {
    if (env.ROUTE_PREFIX.endsWith('/')) {
      buildBase = env.ROUTE_PREFIX;
    } else {
      buildBase = env.ROUTE_PREFIX + '/';
    }
  }

  return {
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.HTML_TITLE,
            injectScript: `<script>window.ENV = { SERVER_MATCH_REGEX: '${env.SERVER_MATCH_REGEX}', MESSAGE_LIST: '${env.MESSAGE_LIST}', HTML_TITLE: '${env.HTML_TITLE}', SERVER_MATCH_REALM: '${env.SERVER_MATCH_REALM ?? ''}', ROUTE_PREFIX: '${env.ROUTE_PREFIX ?? ''}' }</script>`,
          },
        },
      }),
    ],
    base: buildBase,
    server: {
      proxy: {
        "/api": {
          target: "http://rwr.runningwithrifles.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
