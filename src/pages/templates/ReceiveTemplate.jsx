import React, { useContext, useRef } from "react";
import classes from "./receiveTemplate.module.scss";
import logo from "../../assets/logo.png";
import Card from "../../UI/card/Card";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import { Button } from "@fluentui/react-components";
import { PrintRegular } from "@fluentui/react-icons";
import ReactToPrint from "react-to-print";
import tafqeet from "./../../utils/Tafqeet";
import { useQuery } from "react-query";
import { AuthContext } from "../../store/auth-context";

const ReceiveTemplate = () => {
	const componentRef = useRef();
	const authCtx = useContext(AuthContext);
	const navigate = useNavigate();
	const info = useLocation().state.receive;
	const currDate = new Date().toLocaleString().split(",")[1];
	const currTime = new Date().toISOString().split("T")[0];

	return (
		<>
			<TopBar
				right={
					<>
						<Button appearance="secondary" onClick={() => navigate("./..")}>
							رجوع
						</Button>
						<ReactToPrint
							trigger={() => (
								<Button appearance="primary" icon={<PrintRegular />}>
									طباعة
								</Button>
							)}
							content={() => componentRef.current}
						/>
					</>
				}
			/>
			<div
				style={{
					padding: "0 5px",
					marginTop: "80px",
					paddingBottom: "120px",
					display: "flex",
					flexDirection: "column",
					gap: "15px",
				}}
			>
				<Card>
					<div className={classes["view"]}>
						<div className={classes.header}>
							<div className={classes.right}>
								<span>الجمهورية اليمنية</span>
								<span>شركة النفط اليمنية</span>
								<span>فرع محافظة المهرة</span>
								<span>الإدارة المالية</span>
							</div>
							<div className={classes.center}>
								<img alt="" src={logo} />
							</div>
							<div className={classes.left}>
								<div>
									<span>رقم السند: </span>
									<span> {` ${info.id} `}</span>
								</div>
								<div>
									<span>التاريخ: </span>
									<span>{` ${info.date} `}</span>
								</div>
							</div>
						</div>
						<div className={classes.body}>
							<div className={classes.line0}>
								<div className={classes.amount}>
									<span>{info.amount.toLocaleString("US-en")}</span>
									<span>ريال يمني</span>
								</div>
								<div className={classes.title}>سند قبض</div>
								<div className={classes.amount}>
									<span>{info.clauseText}</span>
								</div>
							</div>
							<div className={classes.line1}>
								<span>استلمت من الأخ: </span>
								<span className={classes.bold}>{info.money_from}</span>
								<span>المحترم</span>
							</div>
							<div className={classes.line2}>
								<div className={classes.value}>
									<div>
										<span>مبلغ وقدره</span>
										<span className={classes.bold}>{` ${tafqeet(
											info.amount
										)} `}</span>
										<span>ريال يمني فقط لا غير</span>
									</div>
								</div>
							</div>
							<div className={classes.line3}>
								<span className={classes.bold}>
									{info.type === "شيك" ? "شيك رقم" : "نقداً"}
								</span>
								{info.type === "شيك" ? (
									<span className={classes.bold}> {info.check_number}</span>
								) : (
									""
								)}
								<span>بتاريخ</span>
								<span className={classes.bold}>{info.date}</span>
							</div>
							<div className={classes.line4}>
								<span>وذلك مقابل:</span>
								<span className={classes.bold}>{info.title}</span>
							</div>
							<div className={classes.line5}>
								<div>امين الصندوق</div>
								<div>رئيس قسم الخزينة</div>
								<div>مدير عام الشركة</div>
							</div>
						</div>
					</div>
				</Card>
			</div>

			{/* print element */}
			<div className={classes["print"]} ref={componentRef}>
				<div className={classes.header}>
					<div className={classes.right}>
						<span>الجمهورية اليمنية</span>
						<span>شركة النفط اليمنية</span>
						<span>فرع محافظة المهرة</span>
						<span>الإدارة المالية</span>
					</div>
					<div className={classes.center}>
						<img alt="" src={logo} />
					</div>
					<div className={classes.left}>
						<div>
							<span>رقم السند: </span>
							<span> {` ${info.id} `}</span>
						</div>
						<div>
							<span>التاريخ: </span>
							<span>{` ${info.date} `}</span>
						</div>
					</div>
				</div>
				<div className={classes.body}>
					<div className={classes.line0}>
						<div className={classes.amount}>
							<span>{info.amount.toLocaleString("US-en")}</span>
							<span>ريال يمني</span>
						</div>
						<div className={classes.title}>سند قبض</div>
						<div className={classes.amount}>
							<span>{info.clauseText}</span>
						</div>
					</div>
					<div className={classes.line1}>
						<span>استلمت من الأخ: </span>
						<span className={classes.bold}>{info.money_from}</span>
						<span>المحترم</span>
					</div>
					<div className={classes.line2}>
						<div className={classes.value}>
							<div>
								<span>مبلغ وقدره</span>
								<span className={classes.bold}>{` ${tafqeet(
									info.amount
								)} `}</span>
								<span>ريال يمني فقط لا غير</span>
							</div>
						</div>
					</div>
					<div className={classes.line3}>
						<span className={classes.bold}>
							{info.type === "شيك" ? "شيك رقم" : "نقداً"}
						</span>
						{info.type === "شيك" ? (
							<span className={classes.bold}> {info.check_number}</span>
						) : (
							""
						)}
						<span>بتاريخ</span>
						<span className={classes.bold}>{info.date}</span>
					</div>
					<div className={classes.line4}>
						<span>وذلك مقابل:</span>
						<span className={classes.bold}>{info.title}</span>
					</div>
					<div className={classes.line5}>
						<div>امين الصندوق</div>
						<div>رئيس قسم الخزينة</div>
						<div>مدير عام الشركة</div>
					</div>
					<div className={classes.printData}>
						{`تاريخ الطباعة  ${currTime} ${currDate} `}
						<div>طبع بواسطة :{authCtx.currUser.username}</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ReceiveTemplate;
