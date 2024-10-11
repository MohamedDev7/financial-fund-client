import { useContext, useRef } from "react";
import classes from "./payTemplate.module.scss";
import logo from "../../assets/logo.png";
import Card from "../../UI/card/Card";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import { Button } from "@fluentui/react-components";
import { PrintRegular } from "@fluentui/react-icons";
import ReactToPrint from "react-to-print";
import tafqeet from "./../../utils/Tafqeet";
import { AuthContext } from "../../store/auth-context";

const PaySalaryAdvanceTemplate = () => {
	const authCtx = useContext(AuthContext);

	const componentRef = useRef();
	const navigate = useNavigate();
	const info = useLocation().state.data;
	let date = new Date(info.date).toISOString().split("T")[0];
	const currDate = new Date().toLocaleString().split(",")[1];
	const currTime = new Date().toISOString().split("T")[0];

	//queries

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
									<span>{` ${date} `}</span>
								</div>
							</div>
						</div>
						<div className={classes.body}>
							<div className={classes.line0}>
								<div className={classes.amount}>
									<span>{info.amount.toLocaleString("US-en")}</span>
									<span>ريال يمني</span>
								</div>
								<div className={classes.title}>سند صرف سلفة</div>
							</div>
							<div className={classes.line1}>
								<span>انا الموقع ادناه:</span>
								<span className={classes.bold}>{info.name}</span>
							</div>
							<div className={classes.line2}>
								<div className={classes.value}>
									<div>
										<span>استلمت مبلغ وقدره:</span>
										<span className={classes.bold}>{` ${tafqeet(
											info.amount
										)} `}</span>
										<span>ريال يمني فقط لا غير</span>
									</div>
								</div>
							</div>
							<div className={classes.line3}>وذلك مقابل:</div>
							<div className={classes.line4}>سلفة</div>
							<div className={classes.line5}>
								<div>
									اسم
									المستلم......................................................................................................................................................
								</div>
								<span style={{ paddingRight: "150px" }}>توقيع المستلم</span>
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
							<span>{` ${date} `}</span>
						</div>
					</div>
				</div>
				<div className={classes.body}>
					<div className={classes.line0}>
						<div className={classes.amount}>
							<span>{info.amount.toLocaleString("US-en")}</span>
							<span>ريال يمني</span>
						</div>
						<div className={classes.title}>سند صرف سلفة</div>
					</div>
					<div className={classes.line1}>
						<span>انا الموقع ادناه:</span>
						<span className={classes.bold}>{info.name}</span>
					</div>
					<div className={classes.line2}>
						<div className={classes.value}>
							<div>
								<span>استلمت مبلغ وقدره:</span>
								<span className={classes.bold}>{` ${tafqeet(
									info.amount
								)} `}</span>
								<span>ريال يمني فقط لا غير</span>
							</div>
						</div>
					</div>
					<div className={classes.line3}>وذلك مقابل:</div>
					<div className={classes.line4}>سلفة</div>
					<div className={classes.line5}>
						<div>
							اسم المستلم
							.......................................................................................
						</div>
						<span style={{ paddingRight: "50px" }}>توقيع المستلم</span>
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

export default PaySalaryAdvanceTemplate;
