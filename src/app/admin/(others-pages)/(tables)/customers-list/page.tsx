import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Customers List | RepayKaro",
  description:
    "Customers list",
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Customers List" />
      <div className="space-y-6">
         <BasicTableOne />
      </div>
    </div>
  );
}
