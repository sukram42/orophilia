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

export default function MountainListElement(props: MountainListElementProps){
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
                    title={props.mountain.mountain_name + (props.mountain.height ? ` (${props.mountain.height} m)` : "")}
                    description={props.description}
                    // description={regions[props.mountain.region].name}
                />
            </Card>)
}