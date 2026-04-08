import {
  File,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  FileCheckCorner,
} from "lucide-react";

export const ROLE_STATS = {
  admin: [
    {
      title: "Paid Requests",
      status: "paid",
      color: "yellow",
      icon: CheckCircle,
    },
    {
      title: "Released Documents",
      status: "released",
      color: "green",
      icon: FileCheckCorner,
    },
    {
      title: "Rejected Requests",
      status: "rejected",
      color: "red",
      icon: XCircle,
    },
  ],

  cashier: [
    {
      title: "Pending Requests",
      status: "pending",
      color: "yellow",
      icon: Clock,
    },
    {
      title: "Unpaid Balance",
      status: "balance_due",
      color: "blue",
      icon: CreditCard,
    },
    {
      title: "Pending Payments",
      status: "invoiced",
      color: "cyan",
      icon: File,
    },
  ],

  rmo: [
    {
      title: "Under Review",
      status: "under_review",
      color: "yellow",
      icon: Clock,
    },
    {
      title: "Deficient Requests",
      status: "deficient",
      color: "blue",
      icon: CreditCard,
    },
    {
      title: "Released Documents",
      status: "released",
      color: "green",
      icon: FileCheckCorner,
    },
  ],
};
