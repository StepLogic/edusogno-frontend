import Button from "@mui/material/Button";
import cn from "classnames";
import { concat, filter, map } from "lodash";
import moment, { Moment } from "moment";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CaChevronDown } from "../../../components/Icons";
import { uuid } from "../../../utils/Utils";
import BxInfiniteScroll from "./bx-infinite-scroll";
import Event, { EventProps } from "./event";
import { CalendarValues, Days, Months, renderCalendar } from "./index.logic";
import s from "./index.module.css";
// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}
const getEvents = () => {
  const eventDates = moment({ hour: 9, minute: 30 });
  const events: EventProps[] = [
    {
      title: "Speaking Class",
      topic: "Adjectives and Adverbs",
      date: eventDates.clone(),
      duration: 45,
    },
  ];

  eventDates.add(2, "hours");
  events.push({
    title: "Speaking Class",
    topic: "Adjectives and Adverbs",
    date: eventDates.clone(),
    duration: 45,
  });
  eventDates.add(1, "month");
  events.push({
    title: "Speaking Class",
    topic: "Adjectives and Adverbs",
    date: eventDates.clone(),
    duration: 45,
  });
  return events;
};

function EventGridItem(props: { date: Moment; events?: Array<EventProps> }) {
  const { events, date, ...rest } = props;
  const navigate = useNavigate();
  return (
    <div {...rest} className={s.gridItem}>
      <div className={"flex flex-col text-white"}>
        <p className="uppercase text-[13px] leading-[100.5%] font-[500] text-center">
          {date.format("ddd")}
        </p>
        <p className="text-base font-[700] text-center">{date.format("DD")}</p>
      </div>
      <div className="w-full h-full grid grid-cols-1 gap-[5px]">
        {events && events.length > 0 ? (
          events.map((event) => (
            <Event
              title={"Speaking Class"}
              topic={"Food"}
              date={event.date}
              onClick={() => navigate("event")}
              duration={45}
            />
          ))
        ) : (
          <div className="h-[33px] w-full border-[#D9DAF3] border-solid border-[1px] rounded-[3px] flex flex-row font-[400] items-center pl-4 text-[#D9DAF3] text-[13px] leading-[124%]">
            No event planned
          </div>
        )}
      </div>
    </div>
  );
}
type DayType = {
  value: Moment;
  showMonth?: boolean;
  type: "past" | "now" | "future";
  setOpenModal: Function;
  requestClose: Function;
  events?: EventProps[];
};
const Day = (props: DayType) => {
  const {
    value,
    type,
    showMonth = false,
    setOpenModal,
    requestClose,
    events,
  } = props;
  // const event: EventProps = {
  //   title: "Speaking Class",
  //   topic: "",
  //   date: value.hour(9),
  //   duration: 45,
  // };
  // const [events, setEvents] = useState<Array<EventProps>>([]);

  // const addEvent = () => {
  //   events.length < 2 && setEvents((r) => [...r, event]);
  // };

  if (!Number.isNaN(value.date()))
    return (
      <>
        <div
          id={"calendar"}
          // onClick={() => {
          //   addEvent();
          // }}
          className={cn(s.dateItem, {
            [s.prevDays]: type === "past",
            [s.nextDays]: type === "future",
            [s.currentDays]: type === "now",
            [s.toDay]: moment().isSame(value, "day"),
          })}
        >
          <div className="flex flex-row justify-center items-center gap-[1px] absolute top-[-8px] left-0 right-0">
            {events &&
              events.length > 0 &&
              events.map((event) => {
                return (
                  <div
                    className={cn(s.dot, "text-white", {
                      ["text-[#CCCCCC]"]: !moment().isSame(event.date),
                    })}
                  />
                );
              })}
          </div>
          <p className={cn(s.day)}>{value.date()}</p>
        </div>
      </>
    );
  return <></>;
};
const Header = ({
  calendarValues,
  setObserveNode,
}: {
  setObserveNode: Function;
  calendarValues: CalendarValues;
}) => {
  const [show, setShowCalendar] = useState(false);
  const scrollToday = () => {
    const todayElement = document.querySelector(`[data-todaytarget="true"]`);
    const containerBox = document.querySelector("#containerBox");
    if (todayElement != null) {
      const attribute = todayElement.getAttribute("data-dateItem");
      // const header = document.querySelectorAll(
      //   `[data-dateItem="${attribute}"]`
      // )[0];
      // header?.scrollIntoView({ behavior: "smooth" });
      setObserveNode(renderCalendar(moment(attribute, "MM-YYYY").toDate()));
      todayElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  useEffect(() => {
    scrollToday();
  }, []);
  return (
    <div className={cn(s.calendar, "header relative")}>
      <div className="flex flex-row items-center">
        <div className={cn(s.dateHeading, "!mt-0")}>
          {Months[calendarValues.month]}&nbsp;
          {calendarValues.year}
          <button
            // id={`chevronButton-${id}`}
            className={cn("ml-[8px] hidden", {
              "rotate-180": show,
            })}
            onClick={() => {
              setShowCalendar(!show);
            }}
          >
            <CaChevronDown />
          </button>
        </div>
        <div className={s.actions}>
          <Button
            onClick={() => scrollToday()}
            // id={`todayButtonCalendar-${id}`}
            className={cn(
              "!py-0 !capitalize !hidden ml-auto !text-[13px] leading-[99.5%] !font-[500] items-center justify-center"
            )}
            color="error"
            variant="contained"
          >
            Today
          </Button>
        </div>
      </div>
      <div
        className={cn(
          { hidden: !show },
          `absolute top-[32px] bg-[var(--clr-violet-100)] w-[100%]`
        )}
      >
        <div className={cn(s.daysLabels, "mt-1")}>
          {Days.map((day) => (
            <p key={uuid()}>{day.slice(0, 3)}</p>
          ))}
        </div>
        <div className={cn(s.daysGrid, "mt-4 mb-4")}>
          {calendarValues.prevDaysArray.map((i, index) => {
            if (calendarValues.month - 1 < 0)
              return (
                <Day
                  key={uuid()}
                  setOpenModal={() => {}}
                  requestClose={() => {}}
                  showMonth={index === 0}
                  events={filter(getEvents(), (event) => {
                    return event.date.isSame(
                      moment({
                        day: i,
                        month: 11,
                        year: calendarValues.year - 1,
                      }),
                      "day"
                    );
                  })}
                  value={moment({
                    day: i,
                    month: 11,
                    year: calendarValues.year - 1,
                  })}
                  type="past"
                />
              );
            return (
              <Day
                key={uuid()}
                setOpenModal={() => {}}
                requestClose={() => {}}
                showMonth={index === 0}
                events={filter(getEvents(), (event) => {
                  return event.date.isSame(
                    moment({
                      day: i,
                      month: calendarValues.month - 1,
                      year: calendarValues.year,
                    }),
                    "day"
                  );
                })}
                value={moment({
                  day: i,
                  month: calendarValues.month - 1,
                  year: calendarValues.year,
                })}
                type="past"
              />
            );
          })}
          {calendarValues.daysArray.map((i) => (
            <Day
              key={uuid()}
              setOpenModal={() => {}}
              requestClose={() => {}}
              events={filter(getEvents(), (event) => {
                return event.date.isSame(
                  moment({
                    day: i,
                    month: calendarValues.month,
                    year: calendarValues.year,
                  }),
                  "day"
                );
              })}
              value={moment({
                day: i,
                month: calendarValues.month,
                year: calendarValues.year,
              })}
              type="now"
            />
          ))}
          {calendarValues.nextDaysArray.map((i) => {
            if (calendarValues.month + 1 > 11)
              return (
                <Day
                  key={uuid()}
                  setOpenModal={() => {}}
                  requestClose={() => {}}
                  events={filter(getEvents(), (event) => {
                    return event.date.isSame(
                      moment({
                        day: i,
                        month: 0,
                        year: calendarValues.year + 1,
                      }),
                      "day"
                    );
                  })}
                  value={moment({
                    day: i,
                    month: 0,
                    year: calendarValues.year + 1,
                  })}
                  type="future"
                />
              );
            return (
              <Day
                key={uuid()}
                setOpenModal={() => {}}
                requestClose={() => {}}
                events={filter(getEvents(), (event) => {
                  return event.date.isSame(
                    moment({
                      day: i,
                      month: calendarValues.month + 1,
                      year: calendarValues.year,
                    }),
                    "day"
                  );
                })}
                value={moment({
                  day: i,
                  month: calendarValues.month + 1,
                  year: calendarValues.year,
                })}
                type="future"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
const DateHeading = ({
  date,
  setObserverNode,
  ...rest
}: {
  date: Moment;
  setObserverNode?: Function;
}) => {
  const id = uuid();
  useEffect(() => {
    const containerBox = document.querySelector("#containerBox");
    let options = {
      root: containerBox,
      rootMargin: "10% 0px -80% 0px",
      threshold: 1.0,
    };
    const heading = document.querySelector(`[data-heading="${id}"]`);
    // console.log(headings);
    let observerTwo = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        console.log("entry", entry.target);
        setObserverNode &&
          setObserverNode(
            renderCalendar(
              moment(entry.target.getAttribute("data-date"), "MM-YYYY").toDate()
            )
          );
        // entry.target.scrollIntoView({
        //   behavior: "smooth",
        //   block: "start",
        // });
        entry.target.classList.add("scale-0");

        entry.target.classList.add("max-h-[0]");
      } else {
        entry.target.classList.remove("scale-0");
        entry.target.classList.remove("max-h-[0]");
      }
    }, options);

    if (heading != null) observerTwo.observe(heading);

    return () => {
      observerTwo.disconnect();
    };
  }, []);
  return (
    <div {...rest} data-heading={`${id}`} className={s.dateHeading}>
      {date.format("MMMM")}&nbsp;
      {date.format("YYYY")}
    </div>
  );
};
export default function CalenderSm() {
  const [observerNode, setObserverNode] = useState<CalendarValues>();
  const [items, setItems] = useState<Array<number>>(
    Array.from({ length: 10 }, (_, i) => i + 1)
  );
  const [loadingNext, setLoadingNext] = useState(false);
  const [loadingPrevious, setLoadingPrevious] = useState(false);

  const { height } = useWindowSize();

  const handleNextDataLoad = () => {
    setLoadingNext(true);
    setTimeout(() => {
      const lastValue = items.at(-1) || 0;
      setItems((prevItems) =>
        concat(
          prevItems,
          Array.from({ length: 10 }, (_, i) => lastValue + (i + 1))
        )
      );
      setLoadingNext(false);
    }, 500);
  };

  const handlePreviousDataLoad = () => {
    setLoadingPrevious(true);
    setTimeout(() => {
      setItems((prevItems) =>
        concat(
          Array.from({ length: 10 }, (_, i) => prevItems[0] - i).reverse(),
          prevItems
        )
      );
      setLoadingPrevious(false);
    }, 500);
  };

  return (
    <div
      className="flex flex-col h-full gap-4 w-full pt-[3vh] px-3 sm:px-6"
      // style={{
      //   overflow: "hidden",
      // }}
    >
      {height && (
        <div
          id="observerBox"
          className={s.observerBox}
          style={{
            // minHeight: 50,
            // height: "auto",
            width: "100%",
            height: `${height * 0.03}px`,
            // paddingBottom: "2rem",
          }}
        >
          {observerNode && (
            <Header
              setObserveNode={setObserverNode}
              calendarValues={observerNode}
            />
          )}
        </div>
      )}
      <div
        id={"containerBox"}
        className="text-white w-full gap-6 overflow-hidden"
        style={
          height && {
            boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
            height: `${height * 0.69}px`,
          }
        }
      >
        <BxInfiniteScroll
          loadingComponent={
            <div style={{ padding: "8px 16px" }}>Loading 5 more items...</div>
          }
          nextDataFn={handleNextDataLoad}
          nextEnd={false}
          nextLoading={loadingNext}
          previousDataFn={handlePreviousDataLoad}
          previousEnd={false}
          previousLoading={loadingPrevious}
        >
          {map(items, (value: number) => {
            const _item = moment();
            if (value < 0) {
              _item.subtract(Math.abs(value), "days");
            } else {
              _item.add(value, "days");
            }
            return (
              <>
                {_item.date() === 1 && (
                  <DateHeading
                    setObserverNode={setObserverNode}
                    data-date={`${_item.format("MM-YYYY")}`}
                    date={_item}
                  />
                )}
                <Fragment key={uuid()}>
                  <EventGridItem
                    data-todaytarget={`${_item.isSame(moment(), "day")}`}
                    data-dateItem={`${_item.format("MM-YYYY")}`}
                    date={_item}
                    events={filter(getEvents(), (event) => {
                      return event.date.isSame(_item, "day");
                    })}
                  />
                </Fragment>
              </>
              // <div className="flex-row flex gap-4">
              //   {_item.format("DD-MM-YYYY")} <p>{value}</p>
              // </div>
            );
          })}
        </BxInfiniteScroll>
      </div>
    </div>
  );
}
