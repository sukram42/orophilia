import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { Mountains, supabase } from "../../supabaseClient";
import { CapsuleTabs, FloatingPanel, List, Swiper, Switch, Toast, Tabs, SideBar, reduceMotion, Dialog } from "antd-mobile";

import { AutoSizer, List as VirtualList } from 'react-virtualized';
import "./peaks.css"
import { iconMountain, iconMountainUnmarked } from "../../components/icons/mountain.icon";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import { useDispatch, useSelector } from "react-redux";
import mountainSlice, { MountainFilterTypes, filterMountain, getMountains, loadMountains, loadit } from "../../app/mountainSlice";
import { Button, Card, Image, Space } from "antd";
import {
    ZoomInOutlined,
    ZoomOutOutlined,
} from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import { key } from "localforage";


export default function Peaks() {

    const [activeMountain, setActiveMountain] = useState<Mountains>()
    const [activeMountainIndex, setActiveMountainIndex] = useState<number>()
    const [previewedImage, setPreviewImage] = useState<string>()
    // const [mountains, setMountains] = useState<Array<Mountains>>([])
    const map = useRef()
    const virtualMountainList = useRef()
    const floating = useRef()


    const mountains = useSelector(getMountains)

    const sortedMountainKeys = useMemo(() => {
        return Object.keys(mountains).sort()
    }, [mountains])

    const dispatch = useDispatch()
    useEffect(() => {
        // getMountains()
        dispatch(loadMountains())
    }, [])

    function chooseMountain(mountain) {
        setActiveMountain(mountain)

        const mtIdx = Object.keys(mountains).sort().findIndex((el) => el == mountain.id)
        setActiveMountainIndex(mtIdx)
        virtualMountainList?.current?.scrollToRow(mtIdx)
        virtualMountainList?.current?.recomputeRowHeights(mtIdx)

        floating?.current?.setHeight(window.innerHeight * 0.5)
        map?.current?.setView([mountain.lat, mountain.lon])
        map?.current?.setZoom(15)

    }

    const anchors = [150, window.innerHeight * 0.4, window.innerHeight * 0.9]

    const rowRenderer = ({ key, index, style, isVisible }) => {

        let mt_index = sortedMountainKeys[index]
        let mt = mountains[mt_index]

        // console.log(mt_index, index)

        return (
            // <div style={style}>{index}</div>
            <Card
                style={style}
                key={"table" + key + index}
                onClick={(idx) => chooseMountain(mt)}
            >
                <Meta
                    avatar={
                        <Image
                            src={mt?.wikiimage_url}
                            style={{ borderRadius: 20 }}
                            // fit='cover'
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
                                        {mt?.name}
                                        <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                        <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                                    </Space>
                                ),
                            }}
                            height={70}
                        />}
                    title={mt.name + (mt.height ? ` (${mt.height} m)` : "")}
                    description="This is the description"
                />
            </Card>

        );
    }



    return (
        <div className="map-container">
            <div className="mountain-overlay">
                <FloatingPanel anchors={anchors} ref={floating}>
                    <CapsuleTabs defaultActiveKey='1' onChange={(key) => {
                        if (key === "1") {
                            dispatch(
                            filterMountain([
                                    { type: MountainFilterTypes.HIKE_DIFFICULTY,
                                      value: "4" }
                                ])
                            )
                        }
                    }}>
                        <CapsuleTabs.Tab title="Alle Touren" key="0">
                        </CapsuleTabs.Tab>
                        <CapsuleTabs.Tab title='T1 - T2' key='1'>
                        </CapsuleTabs.Tab>
                        <CapsuleTabs.Tab title='T3-T4' key='2'>
                        </CapsuleTabs.Tab>
                        <CapsuleTabs.Tab title='T5 - T6' key='3'>
                        </CapsuleTabs.Tab>
                        <CapsuleTabs.Tab title='See' key='4'>
                        </CapsuleTabs.Tab>
                        <CapsuleTabs.Tab title='Hütte' key='5'>
                        </CapsuleTabs.Tab>
                    </CapsuleTabs>
                    {/* <List mode="card"> */}
                    <div>
                        <AutoSizer>
                            {({ height, width }) => {
                                return (
                                    <VirtualList
                                        scrollToAlignment="start"
                                        ref={virtualMountainList}
                                        width={400}
                                        height={700}
                                        rowCount={Object.values(mountains).length}
                                        // rowHeight={100}
                                        rowHeight={(idx: number) => {
                                            return idx.index === activeMountainIndex ? 200 : 100
                                        }}
                                        rowRenderer={rowRenderer}
                                    />)
                            }}

                        </AutoSizer></div>
                </FloatingPanel>

            </div>
            {
                Object.keys(mountains)?.length > 0 ? (
                    <MapContainer ref={map}
                        center={
                            [Object.values(mountains)[0].lat, Object.values(mountains)[0].lon]
                        }
                        zoom={13}
                        className="map markercluster-map"
                        style={{ height: '100%', width: '100%' }}>

                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MarkerClusterGroup>
                            {
                                sortedMountainKeys.map((m_idx) => {
                                    let m = mountains[m_idx]
                                    return (
                                        <Marker
                                            key={m.id}
                                            icon={m.id === activeMountain?.id ? iconMountain : iconMountainUnmarked}
                                            position={[m.lat, m.lon]}
                                            mountain={m.id}
                                            // We feed in the mountain for the handlers
                                            // mountain={m}
                                            eventHandlers={{
                                                click(e) {
                                                    chooseMountain(m)
                                                }
                                            }}>
                                        </Marker>)
                                }
                                )}
                        </MarkerClusterGroup>
                    </MapContainer>)
                    : ""
            }
        </div >
    );
}