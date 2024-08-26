import React from "react";

const AU = () => {
  const organizations = [
    {
      name: "Society of Information Technology Enthusiasts",
      imgSrc: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
    {
      name: "Thomasian Gaming Society",
      imgSrc: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
    },
    { name: "Org 3", imgSrc: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" },
    { name: "Org 4", imgSrc: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" },
    { name: "Org 5", imgSrc: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" },
    // Add more organizations as needed
  ];

  const OrganizationRow = ({ imageUrl, name }) => {
    return (
      <tr className="hover:bg-slate-300">
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle h-12 w-12">
                <img src={imageUrl} alt={`Image of ${name}`} />
              </div>
            </div>
          </div>
        </td>
        <td>
          <div className="font-bold">{name}</div>
        </td>
      </tr>
    );
  };

  const OrganizationsTable = ({ organizations }) => {
    return (
      <div className="overflow-x-auto ">
        <table className="table">
          <thead>
            <tr>
              <th>Picture</th>
              <th>Organization Name</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org, index) => (
              <OrganizationRow key={index} imageUrl={org.imgSrc} name={org.name} />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="grid-col-1 text-center xl:text-left">
        <input type="text" placeholder="Search..." className="input input-bordered w-auto  my-4 ml-8 " />
      </div>

      <div className="xl:hidden ">
        <a href="#">
          <OrganizationsTable organizations={organizations} />
        </a>
      </div>

      <div className=" grid-cols-4 gap-4 hidden xl:grid justify-items-center m-5">
        {organizations.map((org, index) => (
          <div key={index} className="relative flex flex-col items-center">
            <a
              href="#"
              className="card card-compact shadow-xl bg-primary hover:bg-gray-100 py-8 px-7 mx-7 rounded-none h-80 flex flex-col"
              style={{ width: "14rem" }} // Fixed width
            >
              {/* Background for the top half of the card */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-black"></div>

              <div className="card-body relative z-10 flex flex-col items-center justify-between h-full">
                <div className="avatar justify-center mb-4">
                  <div className="ring-primary ring-offset-base-100 w-25 rounded-full">
                    <img src={org.imgSrc} alt={org.name} />
                  </div>
                </div>
                <h2
                  className={`card-title text-center font-semibold whitespace-normal ${
                    org.name.length > 20 ? "text-sm" : "text-base"
                  }`}
                >
                  {org.name}
                </h2>
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
};

export default AU;
