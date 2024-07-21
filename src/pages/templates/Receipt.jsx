import React from "react";
import classes from "./receipt.module.scss";
import logo from "../../assets/logo.png";
import { forwardRef } from "react";

const Receipt = forwardRef(({ info }, ref) => {
	return (
		<div className={classes["report-container"]}>
			<div ref={ref} className={classes["view"]}>
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
							<span>رقم السند:</span>
							<span>{info.id}</span>
						</div>
						<div>
							<span>التاريخ:</span>
							<span>{info.date}</span>
						</div>
					</div>
				</div>
			</div>
			{/* print element */}
			<div ref={ref} className={classes["print"]}>
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
							<span>رقم السند:</span>
							<span>{info.id}</span>
						</div>
						<div>
							<span>التاريخ:</span>
							<span>{info.date}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
Receipt.displayName = "Receipt";
export default Receipt;
