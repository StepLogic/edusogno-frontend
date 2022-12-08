import { ReactNode, useState } from "react";
// import Calender from "../../components/calendar";
import s from "./index.module.css";
import { menuItems } from "./constants";
import {
  CaClose,
  CaIcon,
  CaLogout,
  CaRedChevron,
  CaWhatsApp,
} from "../../../components/Icons";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import cn from "classnames";
import { uuid } from "../../../utils/Utils";
import { Button } from "@mui/material";

type Props = {
  // children: ReactNode;
  className?: string;
  open?: boolean;
  handleClose?: () => void;
};
function SideMenu(props: Props) {
  const [count, setCount] = useState(0);
  const { className, open, handleClose } = props;
  // const [isOpen, setIsOpen] = useState(open || false);
  return (
    <ul className={cn(s.root, className, { [s.active]: open })}>
      <div className="flex flex-row w-full  items-center">
        <CaIcon />
        <button
          onClick={() => handleClose && handleClose()}
          className={s.button}
        >
          <CaClose />
        </button>
      </div>
      {menuItems.map((r) => {
        const Icon = r?.Icon;
        return r.type === "item" ? (
          <li key={uuid()}>
            <NavLink
              onClick={() => handleClose && handleClose()}
              to={r.path || r.value}
              className={({ isActive }) => cn(s.item, { [s.active]: isActive })}
            >
              {({ isActive }) => (
                <>
                  {Icon && <Icon />}
                  <p>{r.value}</p>
                  {isActive && <CaRedChevron />}
                </>
              )}
            </NavLink>
          </li>
        ) : (
          <li key={uuid()} className={s.label}>
            {r.value}
          </li>
        );
      })}
      <li className={classNames(s.item, "mt-auto")}>
        <CaWhatsApp />
        <p>Need help?</p>
      </li>
      <li className={classNames(s.item, "mb-10 !text-[var(--clr-violet-300)]")}>
        <CaLogout />
        <p>logout</p>
      </li>
    </ul>
  );
}

export default SideMenu;
