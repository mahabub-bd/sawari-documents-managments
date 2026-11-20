import type { Metadata } from "next";

import DocumentDetails from "@/components/dashboard/bike-information/document-details";
import type { BikeDetailsType } from "@/types";
import { apiUrl } from "@/utils/helper";

export const metadata: Metadata = {
  title: "Document details",
};

interface DocumentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentDetailsPage({
  params,
}: DocumentDetailsPageProps) {
  const { id } = await params;

  let bike: BikeDetailsType | null = null;
  let error: string | null = null;

  try {
    // GET /bike-information/:id returns the document directly (no { data } wrapper)
    const response = await fetch(`${apiUrl}/bike-information/${id}`, {
      cache: "no-store",
    });

    if (response.status === 404) {
      error = "This document does not exist or has been removed.";
    } else if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    } else {
      bike = await response.json();
    }
  } catch (fetchError) {
    console.error("Error loading bike document:", fetchError);
    error =
      "Could not load this document right now. Please refresh the page or try again later.";
  }

  return <DocumentDetails bike={bike} error={error} />;
}
