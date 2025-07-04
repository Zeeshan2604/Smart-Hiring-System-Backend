import React from "react";
import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";
import * as RxIcons from "react-icons/rx";
import * as FaIcons from "react-icons/fa";
import * as HiIcons from "react-icons/hi";

export const SidebarData = [
  {
    title: "Profile",
    path: "/profile",
    icon: <MdIcons.MdAccountCircle />,
    cName: "nav-text",
  },
  // {
  //   title: "Interview Show",
  //   path: "/interview",
  //   icon: <RxIcons.RxCalendar />,
  //   cName: "nav-text",
  // },
  {
    title: "Interviews List",
    path: "/interviewList",
    icon: <MdIcons.MdListAlt />,
    cName: "nav-text",
  },

  {
    title: "Result",
    path: "/viewresult",
    icon: <MdIcons.MdAssessment />,
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
  {
    title: "Resume Builder",
    path: "/resume",
    icon: <FaIcons.FaFileAlt />,
    cName: "nav-text",
  },
  {
    title: "Chat Assistant",
    path: "/chat",
    icon: <HiIcons.HiChatAlt2 />,
    cName: "nav-text",
  }
];
