import Link from "next/link";
import { BookUser, Building2, FileText, Users, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const PageWrapper = ({ children }) => {
  return (
    <div className="flex w-full min-h-full">
      <Sidebar />
      <div className="pt-5 lg:px-20 px-5 pb-20 flex-grow">{children}</div>
    </div>
  );
};

const Sidebar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className="w-16 bg-base text-base-content page_wrapper_height">
      <ul className="flex flex-col items-center justify-start w-full h-full">
        <li className="hover:text-primary my-5">
          <button onClick={() => router.back()} className="tooltip tooltip-right" data-tip="Previous Page">
            <Undo2 size={25} />
          </button>
        </li>
        <li className="hover:text-primary my-5">
          <Link href="/osa/manage-accounts" className="tooltip tooltip-right" data-tip="Manage Accounts">
            <BookUser size={25} />
          </Link>
        </li>
        <li className="hover:text-primary my-5">
          <Link href="/organizations" className="tooltip tooltip-right" data-tip="Organizations">
            <Building2 size={25} />
          </Link>
        </li>
        <li className="hover:text-primary my-5">
          <Link
            href={`/organizations/${session?.user._id}/annexes`}
            className="tooltip tooltip-right"
            data-tip="Annexes"
          >
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