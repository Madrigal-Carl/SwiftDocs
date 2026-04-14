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
      title: "Pending Payments",
      status: "invoiced",
      color: "blue",
      icon: CreditCard,
    },
    {
      title: "Paid Requests",
      status: "paid",
      color: "cyan",
      icon: CheckCircle,
    },
  ],

  rmo: [
    {
      title: "Pending Requests",
      status: "pending",
      color: "yellow",
      icon: Clock,
    },
    {
      title: "Paid Requests",
      status: "paid",
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
