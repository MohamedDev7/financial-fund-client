import { useContext, useRef } from "react";
import classes from "./duesListTemplate.module.scss";
import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import ReactToPrint from "react-to-print";
import Card from "../../UI/card/Card";
import { PrintRegular } from "@fluentui/react-icons";
// import { getRemittancesByDueId } from "../../api/serverApi";
import TemplateTable from "./../../UI/templateTable/TemplateTable";
// import { useQuery } from "react-query";
import { Button } from "@fluentui/react-components";
import { AuthContext } from "../../store/auth-context";
import { getAllTreasuries } from "../../api/serverApi";
import { useQuery } from "react-query";

const columns = [
	{ field: "id", headerName: "المستحق", width: "60px" },
	{ field: "pay_id", headerName: "سند القبض", width: "80px" },
	{ field: "name", headerName: "الاسم", width: "250px" },
	{ field: "amountText", headerName: "المبلغ", width: "120px" },
	{ field: "paid_at", headerName: "تاريخ ووقت الاستلام", width: "190px" },
];

const ReceiveReportTemplate = () => {
	const componentRef = useRef();
	const navigate = useNavigate();
	const info = useLocation().state;
	const authCtx = useContext(AuthContext);
	const currDate = new Date().toLocaleString().split(",")[1];
	const currTime = new Date().toISOString().split("T")[0];
	console.log(`info`, info);
	// const [total, setTotal] = useState(0);

	// queries
	const { data: treasuries } = useQuery({
		queryKey: ["treasuries"],
		queryFn: getAllTreasuries,
		select: (res) => {
			return res.data.treasuries.map((el) => {
				return { ...el };
			});
		},
	});

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
				{treasuries && (
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
										<span>رقم الكشف: </span>
										<span> {` ${info.duesList.id} `}</span>
									</div>
									<div>
										<span>التاريخ: </span>
										<span>{` ${info.duesList.date} `}</span>
									</div>
								</div>
							</div>
							<div className={classes.line0}>
								<div></div>
								<div className={classes.title}>
									كشف استلام {info.duesList.title}
								</div>
								<div className={classes.type}>
									{
										treasuries.filter((el) => el.id === info.duesList.clause)[0]
											.name
									}
								</div>
							</div>

							<TemplateTable columns={columns} rows={info.dues} />
							<TemplateTable
								columns={[
									{ field: "total", headerName: "الاجمالي", width: "390px" },
									{
										field: "value",
										headerName: info.duesList.total.toLocaleString("US-en"),
										width: "120px",
									},
									{
										field: "empty",
										width: "190px",
									},
								]}
								rows={[]}
							/>
						</div>
						{/* print element  */}

						<table className={classes["print"]} ref={componentRef}>
							<thead>
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
											<span>رقم الكشف: </span>
											<span> {` ${info.duesList.id} `}</span>
										</div>
										<div>
											<span>التاريخ: </span>
											<span>{` ${info.duesList.date} `}</span>
										</div>
									</div>
								</div>
								<div className={classes.line0}>
									<div></div>
									<div className={classes.title}>
										كشف استلام {info.duesList.title}
									</div>
									<div className={classes.type}>
										{
											treasuries.filter(
												(el) => el.id === info.duesList.clause
											)[0].name
										}
									</div>
								</div>
							</thead>

							<tbody className={classes.body}>
								<TemplateTable columns={columns} rows={info.dues} />
								<TemplateTable
									columns={[
										{ field: "total", headerName: "الاجمالي", width: "390px" },
										{
											field: "value",
											headerName: info.duesList.total.toLocaleString("US-en"),
											width: "120px",
										},
										{
											field: "empty",
											width: "190px",
										},
									]}
									rows={[]}
								/>
							</tbody>
							<tfoot className={classes.footer}>
								<tr>
									<td>
										<div className={classes.printData}>
											{`تاريخ الطباعة  ${currTime} ${currDate} `}
											<div>طبع بواسطة :{authCtx.currUser.username}</div>
										</div>
									</td>
								</tr>
							</tfoot>
						</table>
					</Card>
				)}
			</div>
		</>
	);
};

export default ReceiveReportTemplate;
