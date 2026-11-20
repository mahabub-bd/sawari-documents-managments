import BikeList from "@/components/dashboard/bike-information/bike-list";
import type { BikeDetailsType } from "@/types";
import { fetchData } from "@/utils/apiServices";

export default async function DocumentsPage() {
  let bikedatas: BikeDetailsType[] = [];
  let error: string | null = null;

  try {
    const data = await fetchData("bike-information");
    bikedatas = Array.isArray(data) ? data : [];
  } catch (fetchError) {
    console.error("Error loading bike documents:", fetchError);
    error =
      "Could not load bike documents right now. Please refresh the page or try again later.";
  }

  return <BikeList bikedatas={bikedatas} error={error} />;
}
