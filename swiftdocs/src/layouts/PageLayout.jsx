import Header from "./Header";

export default function PageLayout({ title, children }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header name={title} />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
