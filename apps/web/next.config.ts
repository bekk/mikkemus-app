import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // "standalone" gir en selvstendig build (inkl. node_modules som trengs)
  // som er ideell for et minimalt Docker-image i produksjon.
  output: "standalone",

  // Bakes inn i koden under `next build`, så /status kan vise når appen sist
  // ble bygget.
  env: {
    BYGGETIDSPUNKT: new Date().toISOString(),
  },
};

export default nextConfig;
