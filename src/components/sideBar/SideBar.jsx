import classes from "./sideBar.module.scss";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import logo from "../../assets/logo.png";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import {
	SettingsRegular,
	DocumentBulletListRegular,
	MoneyRegular,
	WindowBulletListRegular,
	HomeRegular,
} from "@fluentui/react-icons";
import { AuthContext } from "../../store/auth-context";

const SideBar = () => {
	const [active, setActive] = useState("archive");
	const [activeSub, setActiveSub] = useState("archive");
	const authCtx = useContext(AuthContext);

	return (
		<div className={classes.sidebar} style={{ flex: 3 }}>
			<Link to="/">
				<div className={classes.logoContainer}>
					<img src={logo} alt="" className={classes.logo} />
				</div>
			</Link>
			<ul className={classes.list}>
				<Link to="/">
					<li
						className={`${classes.item}`}
						style={{
							justifyContent: "space-between",
						}}
						onClick={() => setActive("home")}
					>
						<span className={classes.text}>
							<HomeRegular style={{ fontSize: "24px" }} />
							<div style={{ display: "block" }}>الرئيسية</div>
						</span>
					</li>
				</Link>
				{authCtx.permissions.addPay ||
				authCtx.permissions.deletePay ||
				authCtx.permissions.addSalaryAdvance ||
				authCtx.permissions.addReceive ||
				authCtx.permissions.deleteReceive ? (
					<>
						<li
							className={`${classes.item}`}
							style={{
								justifyContent: "space-between",
							}}
							onClick={() => setActive("box")}
						>
							<span className={classes.text}>
								<MoneyRegular style={{ fontSize: "24px" }} />
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
							{authCtx.permissions.addReceive ||
							authCtx.permissions.deleteReceive ? (
								<Link to="/receive" onClick={() => setActiveSub("receive")}>
									<div
										className={`${classes.subitem} ${
											activeSub === "receive" ? classes.activeSub : ""
										}`}
									>
										<PanoramaFishEyeIcon
											style={{ fontSize: "24px", padding: "6px" }}
										/>

										<div>
											<span>القبض</span>
										</div>
									</div>
								</Link>
							) : null}
							{authCtx.permissions.addPay || authCtx.permissions.deletePay ? (
								<Link to="/pay/search" onClick={() => setActiveSub("pay")}>
									<div
										className={`${classes.subitem} ${
											activeSub === "pay" ? classes.activeSub : ""
										}`}
									>
										<PanoramaFishEyeIcon
											style={{ fontSize: "24px", padding: "6px" }}
										/>

										<div>
											<span>الصرف</span>
										</div>
									</div>
								</Link>
							) : null}
							{/* {authCtx.permissions.addSalaryAdvance ? (
								<Link
									to="/salaryAdvance"
									onClick={() => setActiveSub("salaryAdvance")}
								>
									<div
										className={`${classes.subitem} ${
											activeSub === "salaryAdvance" ? classes.activeSub : ""
										}`}
									>
										<PanoramaFishEyeIcon
											style={{ fontSize: "24px", padding: "6px" }}
										/>

										<div>
											<span>السلف</span>
										</div>
									</div>
								</Link>
							) : null} */}
						</li>
					</>
				) : null}
				{authCtx.permissions.addDuesList ||
				authCtx.permissions.editDuesList ||
				authCtx.permissions.deleteDuesList ||
				authCtx.permissions.editDuesListState ? (
					<>
						<li
							className={`${classes.item}`}
							style={{
								justifyContent: "space-between",
							}}
							onClick={() => setActive("duesLists")}
						>
							<span className={classes.text}>
								<WindowBulletListRegular style={{ fontSize: "24px" }} />
								<div style={{ display: "block" }}>المستحقات</div>
							</span>
							<span
								className={`${classes.arrow} ${
									active === "duesLists" ? classes.activeArrow : ""
								}`}
								style={{ display: "block" }}
							>
								<KeyboardArrowUpIcon />
							</span>
						</li>

						<li
							className={`${classes.sublist} ${
								active === "duesLists" ? classes.active : ""
							}`}
							style={{ display: "block" }}
						>
							<Link to="/duesLists" onClick={() => setActiveSub("duesLists")}>
								<div
									className={`${classes.subitem} ${
										activeSub === "duesLists" ? classes.activeSub : ""
									}`}
								>
									<PanoramaFishEyeIcon
										style={{ fontSize: "24px", padding: "6px" }}
									/>

									<div>
										<span>المستحقات</span>
									</div>
								</div>
							</Link>
						</li>
					</>
				) : null}
				{authCtx.permissions.receiveReports ? (
					<>
						<li
							className={`${classes.item}`}
							style={{
								justifyContent: "space-between",
							}}
							onClick={() => setActive("reports")}
						>
							<span className={classes.text}>
								<DocumentBulletListRegular style={{ fontSize: "24px" }} />
								<div style={{ display: "block" }}>التقارير</div>
							</span>
							<span
								className={`${classes.arrow} ${
									active === "reports" ? classes.activeArrow : ""
								}`}
								style={{ display: "block" }}
							>
								<KeyboardArrowUpIcon />
							</span>
						</li>
						<li
							className={`${classes.sublist} ${
								active === "reports" ? classes.active : ""
							}`}
							style={{ display: "block" }}
						>
							{authCtx.permissions.receiveReports ? (
								<Link
									to="/ReceiveReport"
									onClick={() => setActiveSub("ReceiveReport")}
								>
									<div
										className={`${classes.subitem} ${
											activeSub === "ReceiveReport" ? classes.activeSub : ""
										}`}
									>
										<PanoramaFishEyeIcon
											style={{ fontSize: "24px", padding: "6px" }}
										/>

										<div>
											<span>تقارير الاستلام</span>
										</div>
									</div>
								</Link>
							) : null}
						</li>
					</>
				) : null}
				{authCtx.permissions.addUser ||
				authCtx.permissions.editUser ||
				authCtx.permissions.deleteUser ||
				authCtx.permissions.addBeneficiary ||
				authCtx.permissions.editBeneficiary ||
				authCtx.permissions.deleteBeneficiary ||
				authCtx.permissions.addTreasury ||
				authCtx.permissions.editTreasury ||
				authCtx.permissions.deleteTreasury ? (
					<>
						<li
							className={`${classes.item}`}
							style={{
								justifyContent: "space-between",
							}}
							onClick={() => setActive("settings")}
						>
							<span className={classes.text}>
								<SettingsRegular style={{ fontSize: "24px" }} />
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
							{authCtx.permissions.addUser ||
							authCtx.permissions.editUser ||
							authCtx.permissions.deleteUser ? (
								<Link to="/users" onClick={() => setActiveSub("users")}>
									<div
										className={`${classes.subitem} ${
											activeSub === "users" ? classes.activeSub : ""
										}`}
									>
										<PanoramaFishEyeIcon
											style={{ fontSize: "24px", padding: "6px" }}
										/>

										<div>
											<span>المستخدمين</span>
										</div>
									</div>
								</Link>
							) : null}
							{authCtx.permissions.addBeneficiary ||
							authCtx.permissions.editBeneficiary ||
							authCtx.permissions.deleteBeneficiary ? (
								<Link
									to="/beneficiaries"
									onClick={() => setActiveSub("beneficiaries")}
								>
									<div
										className={`${classes.subitem} ${
											activeSub === "beneficiaries" ? classes.activeSub : ""
										}`}
									>
										<PanoramaFishEyeIcon
											style={{ fontSize: "24px", padding: "6px" }}
										/>

										<div>
											<span>المستفيدين</span>
										</div>
									</div>
								</Link>
							) : null}
							{authCtx.permissions.addTreasury ||
							authCtx.permissions.editTreasury ||
							authCtx.permissions.deleteTreasury ? (
								<Link
									to="/treasuries"
									onClick={() => setActiveSub("treasuries")}
								>
									<div
										className={`${classes.subitem} ${
											activeSub === "treasuries" ? classes.activeSub : ""
										}`}
									>
										<PanoramaFishEyeIcon
											style={{ fontSize: "24px", padding: "6px" }}
										/>

										<div>
											<span>الصناديق المالية</span>
										</div>
									</div>
								</Link>
							) : null}

							<Link to="/year" onClick={() => setActiveSub("year")}>
								<div
									className={`${classes.subitem} ${
										activeSub === "year" ? classes.activeSub : ""
									}`}
								>
									<PanoramaFishEyeIcon
										style={{ fontSize: "24px", padding: "6px" }}
									/>

									<div>
										<span>الاتصال بسنوات سابقة</span>
									</div>
								</div>
							</Link>
						</li>
					</>
				) : null}
			</ul>
		</div>
	);
};

export default SideBar;
