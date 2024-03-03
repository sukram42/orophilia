import { useMachine } from "@xstate/react";
import { useRef } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMapEvents } from "react-leaflet";
import { planningMachine } from "./planningMachine";
import { iconMountainUnmarked } from "../../components/icons/mountain.icon";
import { useSearchParams } from "react-router-dom";
import { getMountains, loadMountainsById } from "../../app/mountainSlice";
import { useDispatch, useSelector } from "react-redux";
import { FloatingPanel, NavBar, Steps } from "antd-mobile"
import { Avatar, Button, List } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import "./planning.css"

const { Step } = Steps

const LocationFinderDummy = (props: any) => {
    const map = useMapEvents({
        click(e) {
            props.click(e)
        },
    });
    return null;
};


export default function Planning() {

    const [queryDestination, _] = useSearchParams();
    const predefineDestination = queryDestination.get("destination")
    const [state, send] = useMachine(planningMachine)
    const map = useRef()

    const dispatch = useDispatch()
    const mountains = useSelector(getMountains)

    const deletePoint = (point) => {
        if (point.type == "Startpunkt") {
            state.context.start = null
            send({
                type: "RESET_START"
            })
        }
    }

    const statusMapping = {
        "setDestination": 0,
        "setStart": 1,
        "updateWaypoint": 2,
        "addWaypoints": 2,
        "postprocess": 3,
        "done": 3
    }

    if (predefineDestination) {
        //load
        let activeMountain = mountains[predefineDestination]

        if (!activeMountain) {
            dispatch(loadMountainsById([predefineDestination]))
        } else {
            map?.current?.setView([activeMountain.lat, activeMountain.lon])
            send({
                type: "DESTINATION_GIVEN",
                point: { lat: activeMountain.lat, lon: activeMountain.lon }
            })
        }
    }

    // Start with the state machine
    const addWaypointClick = (e: { latlng: { lat: number, lng: number } }) => {
        let eventType
        switch (state.value) {
            case "setDestination":
                eventType = "DESTINATION_SET"
                break;
            case "setStart":
                eventType = "START_SET"
                break;
            case "addWaypoints":
                eventType = "ADD_WAYPOINTS"
        }
        send({
            type: eventType,
            point: { lat: e.latlng["lat"], lon: e.latlng["lng"] }
        })
    }

    const anchors = [170, window.innerHeight * 0.4, window.innerHeight * 0.9]

    const routePoints = [
        { ...state.context.start, type: "Startpunkt" },
        ...state.context.points.map((point) => ({ ...point, type: "Wegpunkt" })),
        { ...state.context.destination, type: "Ziel" }
    ]
    console.log(routePoints)

    return (
        <div className="main-container">
            <NavBar backArrow={false}> Plan tour {state.value}</NavBar>
            <div className="planning-floating-overlay">
                <FloatingPanel anchors={anchors}>
                    <Steps current={statusMapping[state.value]}>
                        <Step title='Ziel wählen' />
                        <Step title='Start wählen' />
                        <Step title='Wegpunkte wählen' />
                        <Step
                            title={
                                statusMapping[state.value] <= 2 ? (
                                    <Button disabled={state.value !== "addWaypoints"} onClick={() => { send({ type: "DONE" }) }}>Fertig</Button>) : "Fertig"
                            }
                        />
                    </Steps>
                    <List
                        dataSource={routePoints}
                        loading={state.value == "updateWaypoint"}
                        itemLayout="horizontal"
                        renderItem={(item, index) => (
                            <List.Item
                                actions={[<Button shape="circle" onClick={() => deletePoint(item)} icon={<DeleteOutlined />} />]}
                            >
                                <List.Item.Meta
                                    title={item.type}
                                    description={`Koordinaten: ${item.lat}, ${item.lon}`}
                                    avatar={<Avatar src={item.type} />}
                                />
                            </List.Item>
                        )} />
                </FloatingPanel>
            </div>
            <MapContainer
                ref={map}
                center={[47.367541, 10.9218856]}
                zoom={13}
                className="map markercluster-map"
                style={{ height: "100%", width: "100%" }}
            >
                {state.context.waypoints ? state.context.waypoints.map((wp) => (
                    <Polyline
                        positions={wp}
                        color="blue"
                        weight={3}
                    />)
                ) : ""}
                <LocationFinderDummy click={addWaypointClick}>
                </LocationFinderDummy>

                {state.context.destination ? <Marker
                    key={`destination${state.context.destination.lat}${state.context.destination.lon}`}
                    icon={iconMountainUnmarked}
                    position={[state.context.destination.lat, state.context.destination.lon]}
                ></Marker> : ""}
                {state.context.start ? <Marker
                    key={`start${state.context.start.lat}${state.context.start.lon}`}
                    icon={iconMountainUnmarked}
                    position={[state.context.start.lat, state.context.start.lon]}
                ></Marker> : ""}
                {
                    state.context.points.map((point) => {
                        return (<Marker
                            key={`${point.lat}${point.lon}`}
                            // icon={iconMountainUnmarked}
                            position={[point.lat, point.lon]}
                        ></Marker>)
                    })
                }
                <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" />
                {/* <TileLayer url="http://services.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}" /> */}
                {/* <TileLayer url="https://maps.bev.gv.at/tiles/karte/{z}/{x}/{y}.png" /> */}
            </MapContainer>

        </div>)
}






