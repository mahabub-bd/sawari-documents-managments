"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Bike,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  Gauge,
  Info,
  MessageSquare,
  Printer,
  Shield,
  User,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { BikeDetailsType } from "@/types";
import { patchData } from "@/utils/apiServices";
import { formatCurrency, formatDateTime } from "@/utils/helper";
import { generateBikePdfContent } from "@/utils/pdfUtils";
import { serverRevalidate } from "@/utils/revalidatePath";
import ImagePreview from "./image-preview";
import TableRowData from "./table-row-data";
import VideoPreview from "./video-preview";

interface DocumentDetailsProps {
  bike: BikeDetailsType | null;
  error?: string | null;
}

const DocumentDetails = ({ bike, error }: DocumentDetailsProps) => {
  const [securityMoneyReturned, setSecurityMoneyReturned] = useState<boolean>(
    bike?.securityMoneyReturned ?? false
  );
  const printRef = useRef<HTMLDivElement>(null);

  if (error || !bike) {
    return (
      <div className="space-y-6">
        <BackLink />
        <Card className="mx-auto max-w-md p-8 text-center">
          <AlertCircle
            className="mx-auto h-10 w-10 text-muted-foreground"
            aria-hidden="true"
          />
          <h1 className="mt-4 text-lg font-semibold">Document not available</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error ?? "This document could not be found."}
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/dashboard/documents">Back to documents</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const isRegistered = bike.registrationStatus === "Registered";
  const pendingSecurity = bike.securityAmount > 0 && !securityMoneyReturned;

  const registrationTone = isRegistered
    ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400"
    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400";

  async function handleSecurityMoneyReturned() {
    try {
      await patchData("bike-information", bike!._id, {
        securityMoneyReturned: !securityMoneyReturned,
      });
      toast.success(
        `Security money ${securityMoneyReturned ? "not returned" : "returned"}`
      );
      serverRevalidate("/dashboard/documents");
      serverRevalidate(`/dashboard/documents/${bike!._id}`);
      setSecurityMoneyReturned(!securityMoneyReturned);
    } catch (err) {
      toast.error("Failed to update security money status. Please try again.");
    }
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups for this website to print documents.");
      return;
    }

    const printContent = generateBikePdfContent(bike);
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="space-y-6">
      <BackLink />

      {/* Page header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/15 to-sky-500/10 text-sky-600 ring-1 ring-sky-500/20 dark:text-sky-400">
            <Bike className="h-6 w-6" aria-hidden="true" />
          </span>
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-bold tracking-tight capitalize sm:text-3xl">
                {bike.bikeBrand} {bike.bikeModel}
              </h1>
              <Badge variant="outline" className={registrationTone}>
                {bike.registrationStatus}
              </Badge>
              {bike.manufacturingYear && (
                <Badge
                  variant="outline"
                  className="font-normal text-muted-foreground"
                >
                  {bike.manufacturingYear}
                </Badge>
              )}
              {pendingSecurity && (
                <Badge
                  variant="outline"
                  className="gap-1.5 border-amber-200 bg-amber-50 font-normal text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Security pending
                </Badge>
              )}
            </div>
            <p className="truncate font-mono text-xs text-muted-foreground">
              {bike.engineNumber} · {bike.chassisNumber}
            </p>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handlePrint}
                aria-label="Print document"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                Print
              </Button>
            </TooltipTrigger>
            <TooltipContent>Generate PDF</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </header>

      {/* Quick facts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" ref={printRef}>
        <QuickFact
          icon={FileText}
          label="Registration"
          value={bike.registrationNumber || "Not assigned"}
        />
        <QuickFact
          icon={Gauge}
          label="Odometer"
          value={`${(bike.odo ?? 0).toLocaleString()} km`}
        />
        <QuickFact
          icon={CreditCard}
          label="Purchase"
          value={formatCurrency(bike.purchaseAmount)}
        />
        <QuickFact
          icon={Shield}
          label="Security"
          value={
            bike.securityAmount > 0
              ? formatCurrency(bike.securityAmount)
              : "—"
          }
          hint={
            bike.securityAmount > 0
              ? securityMoneyReturned
                ? "Returned"
                : "Pending return"
              : "No deposit"
          }
          hintClassName={
            pendingSecurity
              ? "text-amber-600 dark:text-amber-400"
              : securityMoneyReturned
                ? "text-sky-600 dark:text-sky-400"
                : undefined
          }
        />
      </div>

      {/* Main content */}
      <div className="grid gap-4 md:grid-cols-2">
        <DetailSection title="Seller information" icon={User}>
          <Table>
            <TableBody>
              <TableRowData label="Name" value={bike.name} />
              <TableRowData label="Phone number" value={bike.phoneNumber} />
              <TableRowData label="NID number" value={bike.nid} />
              <TableRowData label="Address" value={bike.address} />
            </TableBody>
          </Table>
        </DetailSection>

        <DetailSection title="Bike details" icon={Bike}>
          <Table>
            <TableBody>
              <TableRowData
                label="Bike brand"
                value={bike.bikeBrand.toUpperCase()}
              />
              <TableRowData label="Bike model" value={bike.bikeModel} />
              <TableRowData label="Chassis number" value={bike.chassisNumber} />
              <TableRowData label="Engine number" value={bike.engineNumber} />
              <TableRowData
                label="Manufacturing year"
                value={bike.manufacturingYear}
              />
              <TableRowData
                label="Odometer"
                value={`${(bike.odo ?? 0).toLocaleString()} km`}
              />
              <TableRowData
                label="Registration status"
                value={
                  <Badge variant="outline" className={registrationTone}>
                    {bike.registrationStatus}
                  </Badge>
                }
              />
              {bike.registrationNumber && (
                <TableRowData
                  label="Registration number"
                  value={bike.registrationNumber}
                />
              )}
            </TableBody>
          </Table>
        </DetailSection>

        <DetailSection title="Witness information" icon={UserCheck}>
          <Table>
            <TableBody>
              <TableRowData label="Witness name" value={bike.witnessName} />
              <TableRowData
                label="Witness phone"
                value={bike.witnessPhoneNumber}
              />
              <TableRowData label="Witness NID" value={bike.witnessNID} />
            </TableBody>
          </Table>
        </DetailSection>

        <DetailSection title="Remarks" icon={MessageSquare}>
          <p className="min-h-[76px] rounded-md bg-muted/30 p-3 text-sm leading-relaxed text-muted-foreground">
            {bike.remarks || "No remarks provided"}
          </p>
        </DetailSection>
      </div>

      {/* Documents */}
      <div className="space-y-4">
        <DetailSection title="Identification documents" icon={FileText}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ImagePreview
              title="Seller NID photo"
              imageUrl={bike.sellerNIDPhoto?.path}
              alt="Seller NID Photo"
            />
            <ImagePreview
              title="Seller DL photo"
              imageUrl={bike.sellerDLPhoto?.path}
              alt="Seller DL Photo"
            />
            <ImagePreview
              title="Witness NID photo"
              imageUrl={bike.witnessNIDPhoto?.path}
              alt="Witness NID Photo"
            />
          </div>
        </DetailSection>

        <DetailSection title="Bike documents" icon={Bike}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ImagePreview
              title="Current bike photo"
              imageUrl={bike.currentPhoto?.path}
              alt="Current Bike Photo"
            />
            <ImagePreview
              title="Registration document"
              imageUrl={bike.regDocument?.path}
              alt="Registration Document"
            />
            <VideoPreview
              poster={bike.currentPhoto?.path}
              title="Deal / purchase video"
              videoUrl={bike.sellingVideo?.path}
              alt="Dealing Video"
            />
          </div>
        </DetailSection>
      </div>

      {/* Transaction + record */}
      <div className="grid gap-4 md:grid-cols-2">
        <DetailSection title="Transaction details" icon={DollarSign}>
          <Table>
            <TableBody>
              <TableRowData
                label="Key status"
                value={
                  <Badge variant="outline">
                    {bike.keyStatus === 1 ? "One key" : "Two keys"}
                  </Badge>
                }
              />
              <TableRowData
                label="Purchase amount"
                value={
                  <span className="font-medium text-sky-600 dark:text-sky-400">
                    {formatCurrency(bike.purchaseAmount)}
                  </span>
                }
              />
              <TableRowData
                label="Paid amount"
                value={
                  <span className="font-medium text-violet-600 dark:text-violet-400">
                    {formatCurrency(bike.purchaseAmount - bike.securityAmount)}
                  </span>
                }
              />
              <TableRowData
                label="Security amount"
                value={
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span className="font-medium text-sky-600 dark:text-sky-400">
                      {formatCurrency(bike.securityAmount)}
                    </span>
                    {bike.securityAmount > 0 && (
                      <button
                        type="button"
                        onClick={handleSecurityMoneyReturned}
                        title="Toggle security money status"
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          securityMoneyReturned
                            ? "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400"
                            : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400"
                        )}
                      >
                        {securityMoneyReturned ? (
                          <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <AlertCircle
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        )}
                        {securityMoneyReturned ? "Returned" : "Mark returned"}
                      </button>
                    )}
                  </div>
                }
              />
              {bike.securityAmount > 0 && (
                <TableRowData
                  label="Security status"
                  value={
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm",
                        securityMoneyReturned
                          ? "text-sky-600 dark:text-sky-400"
                          : "text-amber-600 dark:text-amber-400"
                      )}
                    >
                      {securityMoneyReturned ? (
                        <CheckCircle className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      )}
                      {securityMoneyReturned
                        ? "Return completed"
                        : "Pending return"}
                    </span>
                  }
                />
              )}
            </TableBody>
          </Table>
        </DetailSection>

        <DetailSection title="Record information" icon={Info}>
          <Table>
            <TableBody>
              <TableRowData
                label="Created by"
                value={
                  <span className="inline-flex items-center gap-2">
                    <User
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {bike.createdBy?.name}
                  </span>
                }
              />
              <TableRowData
                label="Created at"
                value={
                  <span className="inline-flex items-center gap-2">
                    <Calendar
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {formatDateTime(bike.createdAt)}
                  </span>
                }
              />
              {bike.updateBy?.name && (
                <TableRowData
                  label="Updated by"
                  value={
                    <span className="inline-flex items-center gap-2">
                      <User
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      {bike.updateBy?.name}
                    </span>
                  }
                />
              )}
              <TableRowData
                label="Updated at"
                value={
                  <span className="inline-flex items-center gap-2">
                    <Calendar
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {formatDateTime(bike.updatedAt)}
                  </span>
                }
              />
            </TableBody>
          </Table>
        </DetailSection>
      </div>
    </div>
  );
};

function BackLink() {
  return (
    <Link
      href="/dashboard/documents"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back to documents
    </Link>
  );
}

function QuickFact({
  icon: Icon,
  label,
  value,
  hint,
  hintClassName,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  hintClassName?: string;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium">{value}</p>
      {hint && (
        <p
          className={cn(
            "mt-0.5 truncate text-[11px] text-muted-foreground",
            hintClassName
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

function DetailSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-border/60 bg-card">
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2.5">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      <div className="p-2 sm:p-3">{children}</div>
    </section>
  );
}

export function DocumentDetailsSkeleton() {
  return (
    <div className="space-y-6">
    <Skeleton className="h-4 w-36" />
    <div className="flex items-start gap-3">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-9 w-24 rounded-md" />
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-20 rounded-lg" />
      ))}
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <Skeleton key={index} className="h-64 rounded-lg" />
      ))}
    </div>
  </div>
  );
}

export default DocumentDetails;
