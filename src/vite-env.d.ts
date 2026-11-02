/// <reference types="vite/client" />

declare module "virtual:portfolio-sessions" {
  const sessions: import("./content/schema").PortfolioProject[];
  export default sessions;
}
