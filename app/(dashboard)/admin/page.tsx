import Announcements from "@/components/ui/Announcement";
import AttendanceChartContainer from "@/components/ui/AttendanceChartContainer";
import CountChartContainer from "@/components/ui/CountChartContainer";
import EventCalendar from "@/components/ui/EventCalendar";
import EventCalendarContainer from "@/components/ui/EventCalendarContainer";
import FinanceChart from "@/components/ui/FinanceChart";
import UserCard from "@/components/ui/UserCard";

const AdminPage = ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* Left side of the screen */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* User cards */}
        <div className="flex gap-4 justify-between flex-wrap bg-white rounded-2xl shadow-sm">
          <UserCard type="teacher" icon="/icons/teacher-icon.png" />
          <UserCard type="student" icon="/icons/icon.png" />
          <UserCard type="parent" icon="/icons/parent-icon.png" />
          <UserCard type="event" icon="/icons/event-icon.png" />
        </div>
        {/* Charts */}
        {/* Finance Chart */}
        <div className="w-full h-[450px]">
          <FinanceChart />
        </div>
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px] bg-white rounded-2xl">
            <AttendanceChartContainer />
          </div>
        </div>
      </div>
      {/* Right side of the screen */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  );
};

export default AdminPage;
