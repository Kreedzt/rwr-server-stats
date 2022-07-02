import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "https://rwr-stats-static-1309290864.cos.ap-shanghai.myqcloud.com/server-stats-web/",
});
