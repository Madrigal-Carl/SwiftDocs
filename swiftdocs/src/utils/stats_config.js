import { File, Clock, CheckCircle, XCircle, CreditCard } from "lucide-react";

export const ROLE_STATS = {
  admin: [
    {
      title: "Pending Requests",
      status: "yellow",
      icon: Clock,
    },
    {
      title: "Released Documents",
      status: "green",
      icon: CheckCircle,
    },
    {
      title: "Rejected Requests",
      status: "red",
      icon: XCircle,
    },
  ],

  cashier: [
    {
      title: "Pending Requests",
      status: "yellow",
      icon: Clock,
    },
    {
      title: "Pending Payments",
      status: "cyan",
      icon: File,
    },
    {
      title: "Paid Requests",
      status: "blue",
      icon: CreditCard,
    },
  ],

  rmo: [
    {
      title: "Pending Requests",
      status: "yellow",
      icon: Clock,
    },
    {
      title: "Paid Requests",
      status: "blue",
      icon: CreditCard,
    },
    {
      title: "Released Documents",
      status: "green",
      icon: CheckCircle,
    },
  ],
};
