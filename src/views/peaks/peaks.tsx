import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { Mountain, supabase } from "../../supabaseClient";
import { CapsuleTabs, FloatingPanel, List, Swiper, Switch, Toast, Tabs, SideBar, reduceMotion, Dialog, Popup } from "antd-mobile";

import { AutoSizer, List as VirtualList } from 'react-virtualized';
import "./peaks.css"
import { iconMountain, iconMountainUnmarked } from "../../components/icons/mountain.icon";
import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import { useDispatch, useSelector } from "react-redux";
import mountainSlice, { MountainFilterTypes, filterMountain, getFilteredMountains, getMountains, getMoutainsInArea, loadMountains, loadMountainsById, loadit } from "../../app/mountainSlice";
import { Button, Card, Divider, Form, Image, Slider, Space } from "antd";
import {
    ZoomInOutlined,
    ZoomOutOutlined,
} from '@ant-design/icons';
import Meta from "antd/es/card/Meta";
import { key } from "localforage";
import { getRegions } from "../../app/regionSlice";
import FilterPanel from "../../components/filter-panel/filter-panel.component";
import MountainListElement from "../../components/mountain-list-element/mountain-list-element.component";
import { getRoutes, loadingRoutesByMountain } from "../../app/routesSlice";


export default function Peaks() {

    const [activeMountain, setActiveMountain] = useState<Mountain>()
    const [activeMountainIndex, setActiveMountainIndex] = useState<number>()
    const [previewedImage, setPreviewImage] = useState<string>()
    const [showFilterPane, setShowFilterPane] = useState<boolean>(false)

    const map = useRef()
    const virtualMountainList = useRef()
    const floating = useRef()
    const mountains = useSelector(getFilteredMountains)
    const regions = useSelector(getRegions)

    const routes = useSelector(getRoutes)

    const sortedMountainKeys = useMemo(() => {
        return Object.keys(mountains).sort()
    }, [mountains])

    const dispatch = useDispatch()
    useEffect(() => {
        // getMountains()
        dispatch(loadMountainsById())
    }, [])

    function chooseMountain(mountain) {
        const oldIndex = activeMountainIndex
        if (activeMountain && activeMountain.mountain_id == mountain.id) {
            setActiveMountain(null)
            virtualMountainList?.current?.recomputeRowHeights(oldIndex)
            return
        }
        dispatch(loadingRoutesByMountain(mountain.mountain_id))
        setActiveMountain(mountain)
        const mtIdx = mountains.findIndex((el) => el.mountain_id == mountain.mountain_id)
        setActiveMountainIndex(mtIdx)
        virtualMountainList?.current?.scrollToRow(mtIdx)
        virtualMountainList?.current?.recomputeRowHeights(mtIdx)

        virtualMountainList?.current?.recomputeRowHeights(oldIndex)
        floating?.current?.setHeight(window.innerHeight * 0.5)
        map?.current?.setView([mountain.lat, mountain.lon])
        if(map?.current.getZoom() < 15){ 
            map?.current?.setZoom(15)
        }
    }
    const loadPeaksInView = () => {
        const bounds = map?.current?.getBounds()
        if (bounds === undefined) {
            return
        }
        dispatch(getMoutainsInArea({
            north: bounds.getNorth(),
            east: bounds.getEast(),
            south: bounds.getSouth(),
            west: bounds.getWest()
        }))
    }

    const MapWithPolyline = ({ coordinates, route, width }) => {
        const map = useMap(); // Get access to the map instance
        const polylineRef = useRef();

        // Use useEffect to update the Polyline when coordinates change
        useEffect(() => {
            if (polylineRef.current) {
                polylineRef.current.setLatLngs(coordinates);
            }
        }, [coordinates]);

        return (
            <div>
                <Polyline ref={polylineRef}
                    route={route}
                    // eventHandlers={eventHandlers}
                    positions={coordinates}
                    color="blue"
                    weight={width}
                />
            </div>
        );
    };


    const anchors = [150, window.innerHeight * 0.4, window.innerHeight * 0.9]

    const rowRenderer = ({ key, index, style, isVisible }) => {
        let mt = mountains[index]

        // console.log(mt_index, index)
        return (<MountainListElement
            style={style}
            key={"table" + key + index}
            description={regions[mt.region ? mt.region : "a"]?.name || ""}
            mountain={mt}
            onClick={(mt: Mountain) => chooseMountain(mt)} />
        );
    }

    return (
        <div className="map-container">
            <Popup
                showCloseButton
                position='right'
                visible={showFilterPane}
                onMaskClick={() => {
                    setShowFilterPane(false)
                }}
                onClose={() => {
                    setShowFilterPane(false)
                }}

                bodyStyle={{ width: '100vw' }}
            ><div style={{ "padding": "3em" }}>
                    <FilterPanel></FilterPanel>
                </div>
            </Popup>

            <div className="mountain-overlay">
                <FloatingPanel anchors={anchors} ref={floating}>
                    <Button onClick={() => setShowFilterPane(true)}>Filter</Button>
                    <Button onClick={() => loadPeaksInView()}>Get Peaks in View</Button>
                    <CapsuleTabs defaultActiveKey='0' onChange={(key) => {
                        switch (key) {
                            case "0":
                                dispatch(filterMountain({ filters: [] }))
                                break;
                            case "1":
                                dispatch(
                                    filterMountain({
                                        filters: [
                                            {
                                                type: MountainFilterTypes.HIKE_DIFFICULTY,
                                                value: "4"
                                            }
                                        ]
                                    })
                                )
                        }
                    }}>
                        <CapsuleTabs.Tab title="Alle Berge" key="0">
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

                <MapContainer ref={map}
                    center={
                        [47, 12]
                    }
                    zoom={13}
                    className="map markercluster-map"
                    style={{ height: '100%', width: '100%' }}>

                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {
                        activeMountain && routes[activeMountain.mountain_id]?.map(({ route, waypoints }) => {
                            console.log(waypoints)
                            return (
                                <MapWithPolyline
                                    key={route.id}
                                    width={5}
                                    route={route}
                                    coordinates={waypoints.map(w => w.waypoints)} />)
                        })}
                    <MarkerClusterGroup>
                        {

                            // Show the mountains
                            mountains.map((m) => {
                                return (
                                    <Marker
                                        key={m.mountain_id}
                                        icon={m.mountain_id === activeMountain?.mountain_id ? iconMountain : iconMountainUnmarked}
                                        position={[m.lat, m.lon]}
                                        mountain={m.mountain_id}
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
                </MapContainer>
            }
        </div >
    );
}