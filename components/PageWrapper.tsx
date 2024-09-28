import Link from "next/link";
import { BookUser, Building2, FileText, Users, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

const PageWrapper = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="pt-5 px-20 pb-20 page_wrapper_height container w-11/12">{children}</div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="w-16 bg-base text-base-content">
      <ul className="flex flex-col items-center justify-start w-full h-full">
        <li className="hover:text-primary my-5">
          <Link href="/" className="tooltip tooltip-right" data-tip="Previous Page">
            <Undo2 size={25} />
          </Link>
        </li>
        <li className="hover:text-primary my-5">
          <Link href="/" className="tooltip tooltip-right" data-tip="Manage Users">
            <BookUser size={25} />
          </Link>
        </li>
        <li className="hover:text-primary my-5">
          <Link href="/" className="tooltip tooltip-right" data-tip="Organizations">
            <Building2 size={25} />
          </Link>
        </li>
        <li className="hover:text-primary my-5">
          <Link href="/" className="tooltip tooltip-right" data-tip="Annexes">
            <FileText size={25} />
          </Link>
        </li>
        <li className="hover:text-primary my-5">
          <Link href="/" className="tooltip tooltip-right" data-tip="Manage Signatories">
            <Users size={25} />
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default PageWrapper;
