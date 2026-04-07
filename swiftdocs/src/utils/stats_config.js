import { File, Clock, CheckCircle, XCircle, CreditCard } from "lucide-react";

export const ROLE_STATS = {
  admin: [
    {
      title: "Pending Requests",
      status: "pending",
      color: "yellow",
      icon: Clock,
    },
    {
      title: "Released Documents",
      status: "released",
      color: "green",
      icon: CheckCircle,
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
      title: "Pending Requests",
      status: "pending",
      color: "yellow",
      icon: Clock,
    },
    { title: "Paid Requests", status: "paid", color: "blue", icon: CreditCard },
    {
      title: "Released Documents",
      status: "released",
      color: "green",
      icon: CheckCircle,
    },
  ],
};
