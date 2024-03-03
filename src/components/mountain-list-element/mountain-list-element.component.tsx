import { Card, Image, Space } from "antd";
import { Mountain } from "../../supabaseClient";
import Meta from "antd/es/card/Meta";
import {
    ZoomInOutlined,
    ZoomOutOutlined,
} from '@ant-design/icons';

interface MountainListElementProps {
    mountain: Mountain
    onClick: (mountain: Mountain)=>void
    description: string
    style: any
}

function getDifficultyString(min_hike_difficulty: number, max_hike_difficulty: number, via_ferratas: number): String{

    const viaFerrataString = via_ferratas > 0?"(Klettersteig o. Kletterei)":""

    if (min_hike_difficulty ===null) return "Schwierigkeit noch nicht bestimmt"
    if (min_hike_difficulty === -1) return "Schwierigkeit unbekannt"
    if (min_hike_difficulty === max_hike_difficulty) return `T${min_hike_difficulty} ${viaFerrataString}` 
    return `T${min_hike_difficulty} - T${max_hike_difficulty} ${viaFerrataString}`
}   

export default function MountainListElement(props: MountainListElementProps){
    let search_text =  getDifficultyString(props.mountain.min_hike_difficulty, props.mountain.max_hike_difficulty, props.mountain.via_ferratas)
 
    return (<Card
                style={props.style}
                onClick={()=>props.onClick(props.mountain)}
            >
                <Meta
                    avatar={
                        <Image
                            src={props.mountain.wikiimage_url}
                            style={{ borderRadius: 20 }}
                            width={70}
                            placeholder={true}
                            onClick={(e)=>e.preventDefault()}
                            preview={{
                                toolbarRender: (
                                    _,
                                    {
                                        transform: { scale },
                                        actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
                                    },
                                ) => (
                                    <Space size={12} className="toolbar-wrapper">
                                        {props.mountain.mountain_name}
                                        <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                        <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                                    </Space>
                                ),
                            }}
                            height={70}
                        />}
                    title={props.mountain.mountain_name + (props.mountain.height ? ` (${props.mountain.height} m)`: "")}
                    description={<><div>{props.description}</div><div>{search_text}</div></>}
                    // description={regions[props.mountain.region].name}
                />
            </Card>)
}