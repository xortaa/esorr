import { Bell, CalendarClock } from "lucide-react";

interface OrganizationCardProps {
  image: string;
  name: string;
  status: string;
}

const OrganizationCard = ({ image, name, status }: OrganizationCardProps) => {
  return (
    <div className="p-8 bg-slate-100 shadow-md rounded-md cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex items-center gap-8 h-full">
        <div className="relative w-48 h-48 xl:w-32 xl:h-32 md:w-20 md:h-20">
          <img src={image} alt="org image" className="rounded-full absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="flex-1 h-full flex flex-col justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-black">{name}</h2>
            <p className="text-md text-gray-500">Affiliation</p>
          </div>
          <div className="flex flex-col items-start justify-center gap-1">
            <div className="flex justify-start items-center gap-1">
              <Bell />
              <p className={`text-sm ${status === "For Revision" ? "text-red-600" : "text-green-600"}`}>{status}</p>
            </div>
            <div className="flex justify-start items-center gap-1">
              <CalendarClock />
              <p className="text-sm text-gray-500">Last edited: 24/1/2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;