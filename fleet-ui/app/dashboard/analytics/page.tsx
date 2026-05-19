export default function AnalyticsPage() {
  return (
    <div className="p-4 h-screen w-full">
      <iframe
        src="http://localhost:3001/d/g95qrz/linux-fleet-dashboard?orgId=1&kiosk&theme=light"
        className="w-full h-full rounded-md border border-gray-200 shadow-sm"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}
