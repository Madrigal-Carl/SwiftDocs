import Header from "./Header";

export default function PageLayout({ title, children }) {
  return (
    <div className="flex flex-col h-screen">
      <Header name={title} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
