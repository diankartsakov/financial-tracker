import "./reportCard.scss";

export default function ReportCard({img, title}) {
    
    return (
        <div className="report-card-wrapper">
            <div className="report-card-wrapper-image">
                <img src={img} alt="chart logo"/>
            </div>
            <h3 className="report-card-title">{title}</h3>
        </div>
    )
}