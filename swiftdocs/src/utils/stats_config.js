import { File, Clock, CheckCircle, XCircle, CreditCard } from "lucide-react";

export const ROLE_STATS = {
  admin: [
    {
      title: "Pending Requests",
      status: "pending",
      icon: Clock,
    },
    {
      title: "Released Documents",
      status: "released",
      icon: CheckCircle,
    },
    {
      title: "Rejected Requests",
      status: "rejected",
      icon: XCircle,
    },
  ],

  cashier: [
    {
      title: "Pending Requests",
      status: "pending",
      icon: Clock,
    },
    {
      title: "Pending Payments",
      status: "invoiced",
      icon: File,
    },
    {
      title: "Paid Requests",
      status: "paid",
      icon: CreditCard,
    },
  ],

  rmo: [
    {
      title: "Pending Requests",
      status: "pending",
      icon: Clock,
    },
    {
      title: "Paid Requests",
      status: "paid",
      icon: CreditCard,
    },
    {
      title: "Released Documents",
      status: "released",
      icon: CheckCircle,
    },
  ],
};
