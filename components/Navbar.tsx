"use client";

import { useState } from "react";

const Navbar_AU = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      closeModal();
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="navbar bg-black py-0">
        <div className="navbar-start">
          <a className="btn btn-ghost text-2xl lg:text-xl sm:text-md xl:visible invisible" style={{ color: "#FEC00F" }}>
            E-SORR
          </a>
          <a className="text xl:visible hidden text-nowrap" style={{ color: "#FFFFFF" }}>
            Electronic Student Organization Recognition Requirements
          </a>
        </div>

        <a className="btn btn-ghost text-2xl sm:text-md xl:hidden visible text-center p-0" style={{ color: "#FEC00F" }}>
          E-SORR
        </a>

        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1 bg-primary border-0 p-auto xl:visible invisible">
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-8 rounded-full">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt="User Avatar"
                  />
                </div>
              </div>
              User
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li>
                <a onClick={openModal}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          onClick={handleOutsideClick}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg">Warning:</h3>
            <p className="py-4">Are you sure you want to log out?</p>
            <button onClick={closeModal} className="btn mr-2 justify-end">
              Cancel
            </button>

            {/* Logout Button */}
            <a href="/" className="btn mr-2 justify-end bg-warning">
              Logout
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar_AU;
