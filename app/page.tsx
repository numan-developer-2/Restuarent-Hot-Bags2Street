import { HomePage } from "../components/HomePage";
import { getMenuCatalog } from "../lib/menu";

export default function Page() {
  const catalog = getMenuCatalog();

  return <HomePage catalog={catalog} />;
}
