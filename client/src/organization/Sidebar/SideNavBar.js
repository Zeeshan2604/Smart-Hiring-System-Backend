import React, { useState, useMemo } from "react";
import "./SideNavBar.css";
import { SidebarData } from "./SidebarData";
import * as FiIcons from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { IconContext } from "react-icons";

const SideNavBar = (props) => {
	const { setIsLoggedIn, name, photoUrl } = props;
	const [isExpanded, setExpendState] = useState(false);
	const location = useLocation();
	const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

	// Memoize sidebar data and icons
	const memoSidebarData = useMemo(() => SidebarData, []);
	const memoFiLogOut = useMemo(() => <FiIcons.FiLogOut />, []);

	const showSidebar = () => {
		setExpendState(!isExpanded); //for hamburger
		if (isExpanded) {
			document.body.style.marginLeft = "90px";
		} else {
			document.body.style.marginLeft = "300px";
		}
	};
	const closeSidebar = () => {
		setExpendState(false);
		document.body.style.marginLeft = "90px";
	};

	function handleLogout() {
		window.location.reload();
		document.body.style.marginLeft = "0px";
		setIsLoggedIn(false);
		sessionStorage.removeItem('isLoggedIn');
		window.location.href = '/';
	}

	// Render bottom nav for mobile
	if (isMobile) {
		return (
			<div className="bottom-nav">
				{memoSidebarData.map((item, index) => (
					<Link
						key={index}
						className={`menu-item${location.pathname === item.path ? ' active' : ''}`}
						to={item.path}
					>
						<span className="menu-item-icon">{item.icon}</span>
					</Link>
				))}
				<button className="menu-item" onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit' }}>
					<span className="menu-item-icon">{memoFiLogOut}</span>
				</button>
			</div>
		);
	}

	return (
		<>
			<IconContext.Provider value={{ color: "#fff" }}>
				<div
					className={
						isExpanded
							? "side-nav-container"
							: "side-nav-container side-nav-container-NX"
					}
				>
					<div className="nav-upper">
						<div className="nav-heading">
							{isExpanded && (
								<div className="nav-brand">
									<img
										src="https://storage.googleapis.com/mixo-files/logos/hirEx-1679323310963.svg"
										alt="" srcSet="" />
									<h2>HirEx</h2>
								</div>
							)}
							<button
								className={
									isExpanded ? "hamburger hamburger-in" : "hamburger hamburger-out"
								}
								onClick={showSidebar}
							>
								<span></span>
								<span></span>
								<span></span>
							</button>
						</div>
						<div className="nav-menu">
							{memoSidebarData.map((item, index) => {
								return (
									<Link
										key={index}
										className={isExpanded ? "menu-item" : "menu-item menu-item-NX"}
										to={item.path}
										onClick={closeSidebar}
									>
										<span className="menu-item-icon">
											{item.icon}
										</span>
										{isExpanded && <p>{item.title}</p>}
									</Link>
								);
							})}
						</div>
					</div>
					<div className="nav-footer">
						{isExpanded && (
							<div className="nav-details">
								<img
									className="nav-footer-avatar"
									src={photoUrl || "https://randomuser.me/api/portraits/men/1.jpg"}
									alt="Icon"
									srcSet=""
								/>
								<div className="nav-footer-info">
									<p className="nav-footer-user-name">{name || "Organization"}</p>
									<p className="nav-footer-user-position">Admin</p>
								</div>
							</div>
						)}
						<Link
							to="/"
							className="logout-button"
							onClick={handleLogout}
						>
							<span className="logout-icon">
								{memoFiLogOut}
							</span>
						</Link>
					</div>
				</div>
			</IconContext.Provider >
		</>
	);
};

export default SideNavBar;
