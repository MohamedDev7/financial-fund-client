import React from "react";
import Card from "../../UI/card/Card";
import classes from "./homePage.module.scss";
import { getAllStatistics } from "../../api/serverApi";
import { useQuery } from "react-query";

const HomePage = () => {
	//queries
	const { data: statistics } = useQuery({
		queryKey: ["statistics"],
		queryFn: getAllStatistics,
		select: (res) => {
			console.log(`foo`, res.data.statistics);
			return res.data.statistics;
		},
	});
	return (
		<div className={classes.container}>
			{statistics && (
				<>
					<Card title="الرصيد في الصندوق">
						<div className={classes.card}>
							<div className={classes.number}>
								{statistics.balance.toLocaleString()}
							</div>
							<div className={classes.text}>ريال</div>
						</div>
					</Card>
					<Card title="المستحقات الغير مستلمة">
						<div className={classes.card}>
							<div className={classes.number}>{statistics.unPaid}</div>
							<div className={classes.text}>مستحق</div>
						</div>
					</Card>
					<Card title="الكشوفات المفتوحة">
						<div className={classes.card}>
							<div className={classes.number}>{statistics.openDocs}</div>
							<div className={classes.text}>كشوفات</div>
						</div>
					</Card>
				</>
			)}
		</div>
	);
};

export default HomePage;
