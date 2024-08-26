import { Bell } from "lucide-react";

const OrganizationCard = () => {
  return (
    <div className="rounded-lg w-60 p-4 bg-white  cursor-pointer flex flex-col items-center justify-start hover:shadow-xl">
      <img
        src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQGmtJ00yAfSTtgk2yPubOYVV0zK80A_Hog8JrtXr_1zwSxqsHA"
        className="w-48 h-48 object-cover rounded-lg"
        alt="Organization"
      />
      <div className="mt-4 flex flex-col justify-center items-start gap-2">
        <p className="text-lg font-bold">Sports Innovation And Technology Experts</p>
        <div className="flex items-center justify-start gap-2 text-xs text-slate-500">
          <Bell size={15} />
          <p>For Revision</p>
        </div>
      </div>
    </div>
  );
};
export default OrganizationCard;
