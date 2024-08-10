import { Bell, CalendarClock } from "lucide-react";

interface OrganizationCardProps {
  image: string;
  name: string;
  status: string;
}

const OrganizationCard = ({ image, name, status }: OrganizationCardProps) => {
  return (
    <div className="flex flex-col p-3 bg-slate-100 shadow-md rounded-sm cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:bg-slate-200 h-full">
      <div className="flex items-center gap-4 h-full w-full">
        <div className="">
          <img src={image} alt="org image" className="rounded-full w-20 h-20" />
        </div>
        <div className="flex-1 h-full flex flex-col justify-between items-start gap-4">
          <div>
            <h2 className="text-md font-bold text-neutral">{name}</h2>
            <p className="text-sm text-gray-500">Affiliation</p>
          </div>
          <div className="flex flex-col items-start justify-center gap-1">
            <div className="flex justify-start items-center gap-1">
              <Bell size={15} />
              <p className={`text-sm ${status === "For Revision" ? "text-red-500" : "text-green-600"}`}>{status}</p>
            </div>
            <div className="flex justify-start items-center gap-1">
              <CalendarClock size={15} />
              <p className="text-sm text-gray-400">Last edited: 24/1/2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;
