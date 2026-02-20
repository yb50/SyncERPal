import NavBar from "./NavBar";

export default function AppLayout({ children }) {
  return (
    <div>
      <NavBar />
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}
