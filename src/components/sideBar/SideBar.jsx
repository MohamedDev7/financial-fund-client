import classes from "./sideBar.module.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo.png";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
const SideBar = () => {
	const [active, setActive] = useState("archive");
	const [activeSub, setActiveSub] = useState("archive");

	return (
		<div className={classes.sidebar} style={{ flex: 3 }}>
			<Link to="/">
				<div className={classes.logoContainer}>
					<img src={logo} alt="" className={classes.logo} />
				</div>
			</Link>
			<ul className={classes.list}>
				<li
					className={`${classes.item}`}
					style={{
						justifyContent: "space-between",
					}}
					onClick={() => setActive("box")}
				>
					<span className={classes.text}>
						<PaidOutlinedIcon sx={{ scale: "1.5" }} />
						<div style={{ display: "block" }}>الصندوق</div>
					</span>
					<span
						className={`${classes.arrow} ${
							active === "box" ? classes.activeArrow : ""
						}`}
						style={{ display: "block" }}
					>
						<KeyboardArrowUpIcon />
					</span>
				</li>
				<li
					className={`${classes.sublist} ${
						active === "box" ? classes.active : ""
					}`}
					style={{ display: "block" }}
				>
					<div
						className={`${classes.subitem} ${
							activeSub === "receive" ? classes.activeSub : ""
						}`}
					>
						<Link to="/receive" onClick={() => setActiveSub("receive")}>
							<div>
								<span>القبض</span>
							</div>
						</Link>
					</div>
					<div
						className={`${classes.subitem} ${
							activeSub === "search" ? classes.activeSub : ""
						}`}
					>
						<Link to="/search" onClick={() => setActiveSub("search")}>
							<div>
								<span>بحث المستحقات</span>
							</div>
						</Link>
					</div>
					<div
						className={`${classes.subitem} ${
							activeSub === "pay" ? classes.activeSub : ""
						}`}
					>
						<Link to="/pay" onClick={() => setActiveSub("pay")}>
							<div>
								<span>الصرف</span>
							</div>
						</Link>
					</div>
				</li>

				<li
					className={`${classes.item}`}
					style={{
						justifyContent: "space-between",
					}}
					onClick={() => setActive("remittancesLists")}
				>
					<span className={classes.text}>
						<FeedOutlinedIcon sx={{ scale: "1.5" }} />
						<div style={{ display: "block" }}>المستحقات</div>
					</span>
					<span
						className={`${classes.arrow} ${
							active === "remittancesLists" ? classes.activeArrow : ""
						}`}
						style={{ display: "block" }}
					>
						<KeyboardArrowUpIcon />
					</span>
				</li>
				<li
					className={`${classes.sublist} ${
						active === "remittancesLists" ? classes.active : ""
					}`}
					style={{ display: "block" }}
				>
					<div
						className={`${classes.subitem} ${
							activeSub === "remittancesLists" ? classes.activeSub : ""
						}`}
					>
						<Link
							to="/remittancesLists"
							onClick={() => setActiveSub("remittancesLists")}
						>
							<div>
								<span>المستحقات</span>
							</div>
						</Link>
					</div>
				</li>

				<li
					className={`${classes.item}`}
					style={{
						justifyContent: "space-between",
					}}
					onClick={() => setActive("settings")}
				>
					<span className={classes.text}>
						<PeopleOutlineOutlinedIcon sx={{ scale: "1.5" }} />
						<div style={{ display: "block" }}>الاعدادات</div>
					</span>
					<span
						className={`${classes.arrow} ${
							active === "settings" ? classes.activeArrow : ""
						}`}
						style={{ display: "block" }}
					>
						<KeyboardArrowUpIcon />
					</span>
				</li>
				<li
					className={`${classes.sublist} ${
						active === "settings" ? classes.active : ""
					}`}
					style={{ display: "block" }}
				>
					<div
						className={`${classes.subitem} ${
							activeSub === "users" ? classes.activeSub : ""
						}`}
					>
						<Link to="/users" onClick={() => setActiveSub("users")}>
							<div>
								<span>المستخدمين</span>
							</div>
						</Link>
					</div>
					<div
						className={`${classes.subitem} ${
							activeSub === "beneficiaries" ? classes.activeSub : ""
						}`}
					>
						<Link
							to="/beneficiaries"
							onClick={() => setActiveSub("beneficiaries")}
						>
							<div>
								<span>المستفيدين</span>
							</div>
						</Link>
					</div>
					{/* <div
						className={`${classes.subitem} ${
							activeSub === "selectScaner" ? classes.activeSub : ""
						}`}
					>
						<Link
							to="/selectScaner"
							onClick={() => setActiveSub("selectScaner")}
						>
							<div>
								<span>تحديد الماسح</span>
							</div>
						</Link>
					</div> */}
				</li>
			</ul>
		</div>
	);
};

export default SideBar;
