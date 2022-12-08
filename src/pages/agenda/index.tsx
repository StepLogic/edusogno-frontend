import { useState } from "react";
import { Outlet } from "react-router-dom";
import CalenderLg from "./calender-lg";
import CalenderSm from "./calender-sm";
import s from "./index.module.css";
import { useMediaQuery, useTheme } from "@mui/material";
function Agenda() {
  const [count, setCount] = useState(0);

  return <Outlet />;
}
export function Main() {
  const [count, setCount] = useState(0);
  const theme = useTheme();
  const isSmallSize = useMediaQuery(theme.breakpoints.down("lg"));
  return (
    <div className="h-full w-full overflow-hidden">
      {!isSmallSize ? <CalenderLg /> : <CalenderSm />}
    </div>
  );
}

export default Agenda;
