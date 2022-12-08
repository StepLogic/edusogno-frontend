import { ReactNode, useState } from "react";

import s from "./index.module.css";
import SideMenu from "./side-menu";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { CaIcon, CaThreeBars } from "../../components/Icons";
type Props = {
  // children: ReactNode;
};
function Default(props: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={s.root}>
      <SideMenu
        className={s.sideBar}
        open={open}
        handleClose={() => setOpen(false)}
      />
      <div className="flex flex-col w-full">
        <div className={s.header}>
          <div className="flex flex-row items-center w-full justify-between">
            <CaIcon />
            <button onClick={() => setOpen(true)}>
              <CaThreeBars />
            </button>
          </div>
        </div>
        <div className={s.children}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Default;
