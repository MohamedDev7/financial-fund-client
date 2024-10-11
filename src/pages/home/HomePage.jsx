import React from "react";
import Card from "../../UI/card/Card";
import classes from "./homePage.module.scss";
import { getAllStatistics, getAllTreasuries } from "../../api/serverApi";
import { useQuery } from "react-query";
import Row from "../../UI/row/Row";

const HomePage = () => {
	//queries
	const { data: treasuries } = useQuery({
		queryKey: ["treasuries"],
		queryFn: getAllTreasuries,
		select: (res) => {
			return res.data.treasuries.map((el) => {
				return { ...el };
			});
		},
	});
	const { data: statistics } = useQuery({
		queryKey: ["statistics"],
		queryFn: getAllStatistics,
		select: (res) => {
			let total = 0;
			console.log(`res.data`, res.data);
			const newBalances = res.data.statistics.balances.map((el) => {
				total = total + el.balance;
				return {
					...el,
					clauseText: treasuries.filter((ele) => ele.id === el.clause)[0].name,
				};
			});

			return { ...res.data.statistics, balances: newBalances, total };
		},
		enabled: !!treasuries,
	});
	return (
		<>
			{statistics ? (
				<div className={classes.container}>
					<div style={{ display: "flex", gap: "15px" }}>
						<Card title={`اجمالي الرصيد`} width="500px">
							<div className={classes.card}>
								<div className={classes.number}>
									{(
										statistics.total - statistics.salaryAdvances
									).toLocaleString()}
								</div>
								<div className={classes.text}>ريال</div>
							</div>
						</Card>
						<Card title="المستحقات الغير مستلمة" width="350px">
							<div className={classes.card}>
								<div className={classes.number}>{statistics.unPaid}</div>
								<div className={classes.text}>مستحق</div>
							</div>
						</Card>
						<Card title="الكشوفات المفتوحة" width="350px">
							<div className={classes.card}>
								<div className={classes.number}>{statistics.openDocs}</div>
								<div className={classes.text}>كشوفات</div>
							</div>
						</Card>
					</div>
					<div style={{ display: "flex", gap: "15px" }}>
						{statistics.balances.map((el, i) => (
							<Card title={`رصيد ${el.clauseText}`} key={i}>
								<div className={classes.card}>
									<div className={classes.number}>
										{el.balance.toLocaleString()}
									</div>
									<div className={classes.text}>ريال</div>
								</div>
							</Card>
						))}
						{statistics.salaryAdvances && (
							<Card title="السلف">
								<div className={classes.card}>
									<div className={classes.number}>
										{statistics.salaryAdvances.toLocaleString()}
									</div>
									<div className={classes.text}>ريال</div>
								</div>
							</Card>
						)}
					</div>
				</div>
			) : null}
		</>
	);
};

export default HomePage;
