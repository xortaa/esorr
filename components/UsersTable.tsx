import { Trash2, Filter, Search } from "lucide-react";
import CreateAccountSidebar from "./CreateAccountSidebar";

const UsersTable = () => {
  return (
    <div className="h-full w-full mt-24">
      <div className="flex justify-between items-center w-full my-4">
        <div className="flex items-center justify-center gap-2">
          <button className="btn btn-ghost">
            <Filter />
            Filter
          </button>
          <label className="input input-primary input-bordered border-primary flex items-center gap-2">
            <Search />
            <input type="text" className="grow" placeholder="Search..." />
          </label>
        </div>
        <div className="flex items-center gap-4">
          <CreateAccountSidebar />
          <button className="btn btn-neutral hover:shadow-lg hover:shadow-error">
            <Trash2 />
            Archive Account
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Accreditation Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPhcNkJ7-IxlXnLfMbPwT4l1LROZeDmxoO3A&s"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">SITE ORG</div>
                    <div className="text-sm opacity-50">RSO</div>
                  </div>
                </div>
              </td>
              <td>
                siteorg@ust.edu.ph
                <br />
                <span className="badge badge-ghost badge-sm text-xs">
                  College of Information and Computing Sciences
                </span>
              </td>
              <td>RSO-218ASJ</td>
              <th>
                <button className="btn btn-ghost btn-xs">details</button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default UsersTable;
