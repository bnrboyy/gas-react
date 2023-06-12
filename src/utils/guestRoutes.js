import { Outlet } from "react-router-dom";

const GuestRoutes = () => {
  return (
    <div className="guest-main-page" >
       <div className="guest-image" style={{"--bgimage" : "url('/images/background_img.jpg')"}} >
        {/* <figure className="guest-logo">
          <img src="/images/svg/logo-wynnsoft.svg" />
          <p className="desc">วินน์ซอฟต์ โซลูชั่น ให้บริการด้านการจัดทำเว็บไซต์ ออกแบบเว็บไซต์ รับทำกราฟฟิก การตลาดออนไลน์ เว็บขายของออนไลน์</p>
        </figure>
        <figure className="guest-presenter">
          <img src="/images/presenter.png" />
        </figure> */}
        <figure className="guest-btn">
          <img src="/images/button.png" />
        </figure>
      </div> 
      <div className="form-body">
        <Outlet />
      </div>
    </div>
  );
};

export default GuestRoutes;
