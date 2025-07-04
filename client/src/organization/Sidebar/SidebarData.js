import React from "react";
import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";
// import * as RxIcons from "react-icons/rx";

export const SidebarData = [
  {
    title: "Profile",
    path: "/profile",
    icon: <MdIcons.MdAccountCircle />,
    cName: "nav-text",
  },
  {
    title: "New Interview",
    path: "/newinterview",
    icon: <MdIcons.MdVideoCall />,
    cName: "nav-text",
  },
  {
    title: "All Interviews",
    path: "/all-interviews",
    icon: <MdIcons.MdListAlt />,
    cName: "nav-text",
  },
  {
    title: "Add Students",
    path: "/addstudents",
    icon: <MdIcons.MdPersonAdd />,
    cName: "nav-text",
  },
  {
    title: "Results",
    path: "/viewresults",
    icon: <MdIcons.MdAssessment />,
    cName: "nav-text",
  },
  {
    title: "Search Candidate",
    path: "/search-candidate",
    icon: <BsIcons.BsSearch />,
    cName: "nav-text",
  },
  // {
  //   title: 'Meetings',
  //   path: '/scheduledmeetings',
  //   icon: <MdIcons.MdMoreTime />,
  //   cName: 'nav-text'
  // },
  // {
  //   title: 'Notes',
  //   path: '/notes',
  //   icon: <TbIcons.TbNotes />,
  //   cName: 'nav-text'
  // },
  // {
  //   title: 'Students',
  //   path: '/studentlist',
  //   icon: <CgIcons.CgUserList />,
  //   cName: 'nav-text'
  // },
  // {
  //   title: 'Quick Message',
  //   path: '/message',
  //   icon: <TbIcons.TbMessageShare />,
  //   cName: 'nav-text'
  // }
];
