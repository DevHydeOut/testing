// app/dashboard/page.tsx
import LogoutButton from "@/components/LogoutButton";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>

      {/* …the rest of your dashboard… */}
    </div>
  );
}
