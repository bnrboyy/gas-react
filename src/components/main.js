import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../store/app-slice";
import { useRef } from "react";
import Swal from "sweetalert2";

import "./main.scss";
import FooterComponent from "./layout/footer/footer";
import NavbarComponent from "./layout/navbar/navbar";
import SidebarComponent from "./layout/sidebar/sidebar";
import { svGetOrders, svGetOrderPending } from "../services/orders.service";
import NotificationSound from "./notification-sound.wav";

const MainLayout = (props) => {
  const dispatch = useDispatch();
  const isNavsideCollapse = useSelector((state) => state.app.isNavsideCollapse);
  const newOrders = useSelector((state) => state.app.newOrders);
  const followNO = useSelector((state) => state.app.followNewOrders);
  const audioPlayer = useRef(null);

  const collapseHandler = (status = undefined) => {
    dispatch(appActions.toggleNavsideCollapse(status));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      svGetOrderPending().then((res) =>
        dispatch(appActions.setNewOrders(res.data.data))
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (newOrders > followNO && followNO !== 0) {
      audioPlayer.current.play();
      Swal.fire({
        title: "You have a new order!",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok",
      }).then(() => {
        audioPlayer.current.pause();
        if (window.location.pathname === "/orders") {
          window.location.reload();
        } 
      });
    }
    dispatch(appActions.setFollowNewOrders(newOrders));
  }, [newOrders]);

  return (
    <div className={`App ${isNavsideCollapse ? "collapsed" : ""}`}>
      <div>
        <audio ref={audioPlayer} src={NotificationSound} loop />
      </div>
      <NavbarComponent
        collapseHandler={collapseHandler}
        isCollapsed={isNavsideCollapse}
      />
      <SidebarComponent collapseHandler={collapseHandler} />
      <div className="main-body">
        <main>{props.children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
