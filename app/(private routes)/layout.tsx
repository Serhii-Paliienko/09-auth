import PrivateGuard from "@/components/AuthProvider/PrivateGuard";

export default function PrivateLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <PrivateGuard>
      {children}
      {modal}
    </PrivateGuard>
  );
}
