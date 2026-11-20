"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  AlertCircle,
  Bike,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
  DollarSign,
  ExternalLink as ExternalLinkIcon,
  FileText,
  Gauge,
  Info,
  MessageSquare,
  Printer,
  Shield,
  User,
  UserCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import BrandLogo from "@/components/dashboard/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface BikeItemProps extends BikeDetailsType {
  isLoading?: boolean;
}

const BikeItem = ({ isLoading = false, ...bikeDetails }: BikeItemProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [securityMoneyReturned, setSecurityMoneyReturned] = useState<boolean>(
    bikeDetails.securityMoneyReturned
  );

  const printRef = useRef<HTMLDivElement>(null);

  const isRegistered = bikeDetails.registrationStatus === "Registered";
  const pendingSecurity =
    bikeDetails.securityAmount > 0 && !securityMoneyReturned;

  async function handleSecurityMoneyReturned() {
    try {
      await patchData("bike-information", bikeDetails._id, {
        securityMoneyReturned: !securityMoneyReturned,
      });
      toast.success(
        `Security money ${securityMoneyReturned ? "not returned" : "returned"}`
      );
      serverRevalidate("/dashboard/documents");
      setSecurityMoneyReturned(!securityMoneyReturned);
    } catch (error) {
      toast.error("Failed to update security money status. Please try again.");
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (!isExpanded) setIsExpanded(true);
  };

  const toggleAccordion = () => setIsExpanded(!isExpanded);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups for this website to print documents.");
      return;
    }

    const printContent = generateBikePdfContent(bikeDetails);
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
    };
  };

  if (isLoading) {
    return <BikeItemSkeleton />;
  }

  const registrationTone = isRegistered
    ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400"
    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400";

  return (
    <Card className="overflow-hidden border-border/60 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col gap-2.5 p-3 sm:p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500/15 to-sky-500/10 text-sky-600 ring-1 ring-sky-500/20 dark:text-sky-400">
              <BrandLogo
                brand={bikeDetails.bikeBrand}
                className="h-6 w-6"
                alt=""
              />
            </span>

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-semibold capitalize">
                  <Link
                    href={`/dashboard/documents/${bikeDetails._id}`}
                    className="transition-colors hover:text-sky-600 dark:hover:text-sky-400"
                  >
                    {bikeDetails.bikeBrand} {bikeDetails.bikeModel}
                  </Link>
                </h3>
                <Badge variant="outline" className={registrationTone}>
                  {bikeDetails.registrationStatus}
                </Badge>
                {bikeDetails.manufacturingYear && (
                  <Badge
                    variant="outline"
                    className="font-normal text-muted-foreground"
                  >
                    {bikeDetails.manufacturingYear}
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
              <p className="truncate font-mono text-[11px] text-muted-foreground">
                {bikeDetails.engineNumber} · {bikeDetails.chassisNumber}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handlePrint}
                    aria-label="Print document"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Generate PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    aria-label="Open full page"
                  >
                    <Link href={`/dashboard/documents/${bikeDetails._id}`}>
                      <ExternalLinkIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open full page</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={toggleAccordion}
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {isExpanded ? "Collapse" : "Details"}
              </span>
            </Button>
          </div>
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          <QuickFact
            icon={FileText}
            label="Registration"
            value={bikeDetails.registrationNumber || "Not assigned"}
          />
          <QuickFact
            icon={Gauge}
            label="Odometer"
            value={`${(bikeDetails.odo ?? 0).toLocaleString()} km`}
          />
          <QuickFact
            icon={CreditCard}
            label="Purchase"
            value={formatCurrency(bikeDetails.purchaseAmount)}
          />
          <QuickFact
            icon={Shield}
            label="Security"
            value={
              bikeDetails.securityAmount > 0
                ? formatCurrency(bikeDetails.securityAmount)
                : "—"
            }
            hint={
              bikeDetails.securityAmount > 0
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
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="animate-in border-t border-border/60 fade-in-0 slide-in-from-top-1 duration-200">
          <Tabs
            defaultValue="details"
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="border-b border-border/60 px-4 pt-3 sm:px-5">
              <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="details"
                  className="gap-2 rounded-none border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:border-sky-500 data-[state=active]:bg-transparent data-[state=active]:text-sky-700 data-[state=active]:shadow-none dark:data-[state=active]:text-sky-400"
                >
                  <Bike className="h-4 w-4" aria-hidden="true" />
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="gap-2 rounded-none border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:border-sky-500 data-[state=active]:bg-transparent data-[state=active]:text-sky-700 data-[state=active]:shadow-none dark:data-[state=active]:text-sky-400"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="transaction"
                  className="gap-2 rounded-none border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:border-sky-500 data-[state=active]:bg-transparent data-[state=active]:text-sky-700 data-[state=active]:shadow-none dark:data-[state=active]:text-sky-400"
                >
                  <DollarSign className="h-4 w-4" aria-hidden="true" />
                  Transaction
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4 sm:p-5" ref={printRef}>
              <TabsContent value="details" className="m-0">
                <div className="grid gap-4 md:grid-cols-2">
                  <DetailSection title="Seller information" icon={User}>
                    <Table>
                      <TableBody>
                        <TableRowData label="Name" value={bikeDetails.name} />
                        <TableRowData
                          label="Phone number"
                          value={bikeDetails.phoneNumber}
                        />
                        <TableRowData
                          label="NID number"
                          value={bikeDetails.nid}
                        />
                        <TableRowData
                          label="Address"
                          value={bikeDetails.address}
                        />
                      </TableBody>
                    </Table>
                  </DetailSection>

                  <DetailSection title="Bike details" icon={Bike}>
                    <Table>
                      <TableBody>
                        <TableRowData
                          label="Bike brand"
                          value={bikeDetails.bikeBrand.toUpperCase()}
                        />
                        <TableRowData
                          label="Bike model"
                          value={bikeDetails.bikeModel}
                        />
                        <TableRowData
                          label="Chassis number"
                          value={bikeDetails.chassisNumber}
                        />
                        <TableRowData
                          label="Engine number"
                          value={bikeDetails.engineNumber}
                        />
                        <TableRowData
                          label="Manufacturing year"
                          value={bikeDetails.manufacturingYear}
                        />
                        <TableRowData
                          label="Odometer"
                          value={`${(bikeDetails.odo ?? 0).toLocaleString()} km`}
                        />
                        <TableRowData
                          label="Registration status"
                          value={
                            <Badge variant="outline" className={registrationTone}>
                              {bikeDetails.registrationStatus}
                            </Badge>
                          }
                        />
                        {bikeDetails.registrationNumber && (
                          <TableRowData
                            label="Registration number"
                            value={bikeDetails.registrationNumber}
                          />
                        )}
                      </TableBody>
                    </Table>
                  </DetailSection>

                  <DetailSection title="Witness information" icon={UserCheck}>
                    <Table>
                      <TableBody>
                        <TableRowData
                          label="Witness name"
                          value={bikeDetails.witnessName}
                        />
                        <TableRowData
                          label="Witness phone"
                          value={bikeDetails.witnessPhoneNumber}
                        />
                        <TableRowData
                          label="Witness NID"
                          value={bikeDetails.witnessNID}
                        />
                      </TableBody>
                    </Table>
                  </DetailSection>

                  <DetailSection title="Remarks" icon={MessageSquare}>
                    <p className="min-h-[76px] rounded-md bg-muted/30 p-3 text-sm leading-relaxed text-muted-foreground">
                      {bikeDetails.remarks || "No remarks provided"}
                    </p>
                  </DetailSection>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="m-0 space-y-4">
                <DetailSection
                  title="Identification documents"
                  icon={FileText}
                >
                  <div className="grid gap-4 print:hidden sm:grid-cols-2 lg:grid-cols-3">
                    <ImagePreview
                      title="Seller NID photo"
                      imageUrl={bikeDetails.sellerNIDPhoto?.path}
                      alt="Seller NID Photo"
                    />
                    <ImagePreview
                      title="Seller DL photo"
                      imageUrl={bikeDetails.sellerDLPhoto?.path}
                      alt="Seller DL Photo"
                    />
                    <ImagePreview
                      title="Witness NID photo"
                      imageUrl={bikeDetails.witnessNIDPhoto?.path}
                      alt="Witness NID Photo"
                    />
                  </div>
                </DetailSection>

                <DetailSection title="Bike documents" icon={Bike}>
                  <div className="grid gap-4 print:hidden sm:grid-cols-2 lg:grid-cols-3">
                    <ImagePreview
                      title="Current bike photo"
                      imageUrl={bikeDetails.currentPhoto?.path}
                      alt="Current Bike Photo"
                    />
                    <ImagePreview
                      title="Registration document"
                      imageUrl={bikeDetails.regDocument?.path}
                      alt="Registration Document"
                    />
                    <VideoPreview
                      poster={bikeDetails.currentPhoto?.path}
                      title="Deal / purchase video"
                      videoUrl={bikeDetails.sellingVideo?.path}
                      alt="Dealing Video"
                    />
                  </div>
                </DetailSection>
              </TabsContent>

              <TabsContent value="transaction" className="m-0">
                <div className="grid gap-4 md:grid-cols-2">
                  <DetailSection title="Transaction details" icon={DollarSign}>
                    <Table>
                      <TableBody>
                        <TableRowData
                          label="Key status"
                          value={
                            <Badge variant="outline">
                              {bikeDetails.keyStatus === 1
                                ? "One key"
                                : "Two keys"}
                            </Badge>
                          }
                        />
                        <TableRowData
                          label="Purchase amount"
                          value={
                            <span className="font-medium text-sky-600 dark:text-sky-400">
                              {formatCurrency(bikeDetails.purchaseAmount)}
                            </span>
                          }
                        />
                        <TableRowData
                          label="Paid amount"
                          value={
                            <span className="font-medium text-violet-600 dark:text-violet-400">
                              {formatCurrency(
                                bikeDetails.purchaseAmount -
                                  bikeDetails.securityAmount
                              )}
                            </span>
                          }
                        />
                        <TableRowData
                          label="Security amount"
                          value={
                            <div className="flex flex-wrap items-center justify-end gap-2">
                              <span className="font-medium text-sky-600 dark:text-sky-400">
                                {formatCurrency(bikeDetails.securityAmount)}
                              </span>
                              {bikeDetails.securityAmount > 0 && (
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
                                    <Shield
                                      className="h-3.5 w-3.5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <AlertCircle
                                      className="h-3.5 w-3.5"
                                      aria-hidden="true"
                                    />
                                  )}
                                  {securityMoneyReturned
                                    ? "Returned"
                                    : "Mark returned"}
                                </button>
                              )}
                            </div>
                          }
                        />
                        {bikeDetails.securityAmount > 0 && (
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
                                  <CheckCircle
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <AlertCircle
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
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
                              {bikeDetails.createdBy?.name}
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
                              {formatDateTime(bikeDetails.createdAt)}
                            </span>
                          }
                        />
                        {bikeDetails.updateBy?.name && (
                          <TableRowData
                            label="Updated by"
                            value={
                              <span className="inline-flex items-center gap-2">
                                <User
                                  className="h-4 w-4 text-muted-foreground"
                                  aria-hidden="true"
                                />
                                {bikeDetails.updateBy?.name}
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
                              {formatDateTime(bikeDetails.updatedAt)}
                            </span>
                          }
                        />
                      </TableBody>
                    </Table>
                  </DetailSection>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-border/60 bg-muted/20 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Calendar className="h-3 w-3" aria-hidden="true" />
          Added {formatDateTime(bikeDetails.createdAt)}
        </p>

        <TooltipProvider>
          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="gap-1.5 border-sky-200 bg-sky-50 py-1 pl-2 pr-2.5 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400"
                >
                  <CreditCard className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatCurrency(bikeDetails.purchaseAmount)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Purchase amount</TooltipContent>
            </Tooltip>

            {bikeDetails.securityAmount > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1.5 py-1 pl-2 pr-2.5",
                      securityMoneyReturned
                        ? "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400"
                        : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400"
                    )}
                  >
                    <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatCurrency(bikeDetails.securityAmount)}
                    {!securityMoneyReturned && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                      </span>
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  {securityMoneyReturned
                    ? "Security deposit (returned)"
                    : "Security deposit (pending)"}
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="gap-1.5 border-violet-200 bg-violet-50 py-1 pl-2 pr-2.5 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400"
                >
                  <Wallet className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatCurrency(
                    bikeDetails.purchaseAmount - bikeDetails.securityAmount
                  )}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Paid amount</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </Card>
  );
};

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
    <div className="rounded-md border border-border/50 bg-muted/30 px-2 py-1.5">
      <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-2.5 w-2.5" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-0.5 break-words text-xs font-medium">{value}</p>
      {hint && (
        <p
          className={cn(
            "mt-0.5 truncate text-[10px] text-muted-foreground",
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

export function BikeItemSkeleton() {
  return (
    <Card className="overflow-hidden border-border/60 shadow-sm">
      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-52" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-6 w-48" />
      </div>
    </Card>
  );
};

export default BikeItem;
