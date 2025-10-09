import "./header.css";


export const Header = () => {
  const handleClick = () => {
    document.body.classList.add('sidebar-expand');
  };
  return (
    // <header className="header">
    //   <h1 className="header-title">Kasagardem's Control Center</h1>
    //   <div className="header-actions">
    //     <button className="notification-btn" aria-label="Notifications">
    //       🔔
    //     </button>
    //     <div className="user-profile">
    //       <div className="user-avatar">👤</div>
    //     </div>
    //   </div>
    // </header>
    <>
    <header className="header_main">
      <div className="inner_header_main">
        <div className="row align-items-center">
          <div className="col-auto d-lg-none pe-0" >
              <div className="mobile_bars">
                  <a href="javascript:void(0)" onClick={handleClick}  className="mobile_bars_links"><svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m22 16.75c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm0-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm0-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75z" fill-rule="nonzero"/></svg></a>
              </div>
          </div>
          <div className="col">
            <h4 className="welcome_head">Welcome to the <strong>Kasagardem Dashboard</strong></h4>
          </div>
          <div className="col-auto">
            <ul className="name_area">
              <li className="name_box">AM</li>
              <li className="admin_name">Admin</li>
            </ul>
          </div>
      </div>
      </div>
      
    </header>
    <div className="breadcrumps_cus">
        <ul>
          <li>
            <a href="">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="17" viewBox="0 0 21 17" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.763672 15.9792C0.763672 15.6129 1.06061 15.3159 1.42691 15.3159H19.9976C20.3638 15.3159 20.6608 15.6129 20.6608 15.9792C20.6608 16.3455 20.3638 16.6424 19.9976 16.6424H1.42691C1.06061 16.6424 0.763672 16.3455 0.763672 15.9792Z" fill="#B48A3E"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.05908 10.6732C8.05908 10.3069 8.35602 10.0099 8.72232 10.0099H12.7017C13.068 10.0099 13.365 10.3069 13.365 10.6732V15.9791C13.365 16.3453 13.068 16.6423 12.7017 16.6423C12.3354 16.6423 12.0385 16.3453 12.0385 15.9791V11.3364H9.38556V15.9791C9.38556 16.3453 9.08861 16.6423 8.72232 16.6423C8.35602 16.6423 8.05908 16.3453 8.05908 15.9791V10.6732Z" fill="#B48A3E"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.41666 7.08267C3.78295 7.08267 4.07989 7.37961 4.07989 7.74591V15.9792C4.07989 16.3455 3.78295 16.6424 3.41666 16.6424C3.05036 16.6424 2.75342 16.3455 2.75342 15.9792V7.74591C2.75342 7.37961 3.05036 7.08267 3.41666 7.08267Z" fill="#B48A3E"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.008 7.08267C18.3743 7.08267 18.6712 7.37961 18.6712 7.74591V15.9792C18.6712 16.3455 18.3743 16.6424 18.008 16.6424C17.6417 16.6424 17.3447 16.3455 17.3447 15.9792V7.74591C17.3447 7.37961 17.6417 7.08267 18.008 7.08267Z" fill="#B48A3E"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2041 0.161965C10.3651 0.0952113 10.5378 0.0608521 10.7121 0.0608521C10.8864 0.0608521 11.059 0.0952113 11.22 0.161965C11.3811 0.228719 11.5274 0.326557 11.6506 0.449889L19.8032 8.60332C20.0622 8.86235 20.0621 9.28229 19.8031 9.54128C19.5441 9.80028 19.1242 9.80026 18.8652 9.54124L10.7121 1.38733L2.559 9.54124C2.3 9.80026 1.88006 9.80028 1.62104 9.54128C1.36202 9.28229 1.36199 8.86235 1.62099 8.60332L9.7736 0.449889C9.89679 0.326557 10.0431 0.228719 10.2041 0.161965Z" fill="#B48A3E"/>
          </svg></a>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M6.58447 13.2121L10.8877 8.90894C11.3959 8.40074 11.3959 7.56913 10.8877 7.06093L6.58447 2.75772" stroke="#313131" stroke-width="1.25053" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </li>
          <li>Diagnostic Questions</li>
        </ul>
      </div>
    </>
  );
};
