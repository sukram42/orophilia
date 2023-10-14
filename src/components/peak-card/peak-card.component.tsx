import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { Image } from "antd-mobile"

export default function PeakCard(props) {
    return (
        <Card
            hoverable
            style={{ width: "100%"}}
            cover={
                <div style={{ backgroundImage: "url(" + props.mountain?.wikiimage_url + ")", width: "100%", height: "10em", backgroundSize: "cover", backgroundPosition: "10%" }} />
            }
        >
            <Meta title={props.mountain?.name} description="www.instagram.com" />
        </Card>
    )
}