import { text } from "stream/consumers";

const Navbar_SOCC = () => {
    return (
        <div className="navbar bg-black">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>

          </div>
          <a className="btn btn-ghost text-xl" style={{ color: "#FEC00F" }}>E-SORR</a>
          </div>
  
        <div className="navbar-end">
        <div className="dropdown dropdown-end">
  <div tabIndex={0} role="button" className="btn m-1 bg-primary">
    
  <div className="avatar" >
  <div className="ring-primary ring-offset-base-100 w-8 rounded-full">
    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
  </div>
  </div>
    User
</div>
  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>


  </ul>
  
</div>
        </div>
      </div>
    );
}
export default Navbar_SOCC;