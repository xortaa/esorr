import { CornerDownLeft } from "lucide-react";

interface Props {
  prevStep: () => void;
  nextStep: () => void;
}

const OrganizationSetupStep3 = ({ prevStep, nextStep }: Props) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Confirm Setup</h2>
      <div className="w-full flex flex-col gap-6">
        <div>
          <p className="text-xl slate-500">Organization Name:</p>
          <p>Society of Information Technology Enthusiasts</p>
        </div>
        <div>
          <p className="text-xl">Organization Logo:</p>
          <div className="avatar">
            <div className="w-24 rounded">
              <img
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt="Organization Logo"
              />
            </div>
          </div>
        </div>
        <div>
          <p className="text-2xl">Socials:</p>
          <div className="overflow-x-auto">
            <table className="table ">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Platform</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>Hart Hagerty</td>
                  <td>Desktop Support Technician</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Tax Accountant</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <p className="text-2xl">Signatory Accounts:</p>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Email</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr>
                  <th>1</th>
                  <td>Cy Ganderton</td>
                  <td>Quality Control Specialist</td>
                </tr>
                {/* row 2 */}
                <tr>
                  <th>2</th>
                  <td>Hart Hagerty</td>
                  <td>Desktop Support Technician</td>
                </tr>
                {/* row 3 */}
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Tax Accountant</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end gap-2 items-center w-full mt-8">
          <button className="btn btn-secondary" onClick={prevStep}>
            <CornerDownLeft />
            Previous Step
          </button>
          <button className="btn btn-primary" type="submit" onClick={nextStep}>
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};

export default OrganizationSetupStep3;
