import { useEffect, useMemo, useRef, useState } from "react"
import { Mountains, supabase } from "../../supabaseClient"
import { Avatar, Button, List, Tooltip } from "antd"
import { useNavigate } from "react-router-dom"

import "./home.css"
import { MapContainer, TileLayer, Polyline, useMap, Marker, Popup } from "react-leaflet"

export default function Root() {

    const [mountains, setMountains] = useState<Array<Mountains>>([])
    const [activeMountain, setActiveMountain] = useState<Mountains>()
    const [loading, setLoading] = useState<boolean>(false)
    const [user, setUser] = useState()
    const [routes, setRoutes] = useState({})
    const navigate = useNavigate();

    const [hoveredPosition, setHoveredPosition] = useState(null);
    const [hoveredRoute, setHoveredRoute] = useState(null);
    const map = useRef()

    useEffect(() => {
        getMountains()
    }, [])

    //  Get Mountains
    async function getMountains(): Promise<void> {
        // Get Mountains with Route
        const { data: mnts } = await supabase.from("routes").select("mountain")
        let mountain_ids = [...new Set(mnts?.map(m => m.mountain))]
        const { data } = await supabase.from("mountains").select().in("id", mountain_ids)
        setMountains(data!);
    }
    async function chooseMountain(item: Mountains) {
        setLoading(true)
        setActiveMountain(item)
        // Fetch the routes
        // Get all routes
        const { data: route_id } = await supabase.from("routes").select(`
        id
        `).eq("mountain", item.id)
        let positions = {}
        let { data: routesInformation } = await supabase.from("routes").select(`*`)

        routesInformation = routesInformation.map((item) => ({ [item.id]: item })).reduce((a, b) => ({ ...a, ...b }))

        let routes = await Promise.all(route_id.map(async route => {
            const { data: waypoints } = await supabase.from("route2waypoint").select(`
                waypoints (lat, lon),
                index, 
                route
            `).eq("route", route.id)

            console.log("map", map, item)
            async function choosemountain(item: mountains) {
                setLoading(true)
                setActiveMountain(item)
                // Fetch the routes
                // Get all routes
                const { data: route_id } = await supabase.from("routes").select(`
        id
        `).eq("mountain", item.id)
                let positions = {}
                let { data: routesInformation } = await supabase.from("routes").select(`*`)

                routesInformation = routesInformation.map((item) => ({ [item.id]: item })).reduce((a, b) => ({ ...a, ...b }))

                let routes = await Promise.all(route_id.map(async route => {
                    const { data: waypoints } = await supabase.from("route2waypoint").select(`
                waypoints (lat, lon),
                index, 
                route
            `).eq("route", route.id)

                    console.log("map", map, item)
                    map?.current?.setView([item.lat, item.lon])

                    return {
                        [route.id]: {
                            route: routesInformation[route.id],
                            waypoints: waypoints!.map(item => [...[item.waypoints.lat], ...[item.waypoints.lon]])
                        }
                    }
                }))
                setRoutes(routes.reduce((a, b) => ({ ...a, ...b })))
                setLoading(false)
            }

            return {
                [route.id]: {
                    route: routesInformation[route.id],
                    waypoints: waypoints!.map(item => [...[item.waypoints.lat], ...[item.waypoints.lon]])
                }
            }
        }))
        setRoutes(routes.reduce((a, b) => ({ ...a, ...b })))
        setLoading(false)
    }

    const eventHandlers = useMemo(
        () => ({
            mouseover(e) {
                // setHoveredPosition(e.latlng)
                setHoveredRoute(e.target.options.route)
            },
            mouseout(e) {
                // setHoveredPosition(null)
                setHoveredRoute(null)
            }
        }),
        [],
    )
    async function logout() {
        await supabase.auth.signOut()
        navigate("/login")
    }
    function SetViewOnClick(coords) {
        const map = useMap();
        map.setView(coords, map.getZoom());
        return null;
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
                    eventHandlers={eventHandlers}
                    positions={coordinates}
                    color="blue"
                    weight={width}
                />
            </div>
        );
    };

    console.log(hoveredRoute)
    return (
        <div className="homeContainer">
            {/* <div className="list"> */}
                <List
                    bordered
                    dataSource={mountains}
                    renderItem={(item) => (
                        <List.Item onClick={() => {
                            chooseMountain(item);
                        }
                        }
                            extra={
                                <img
                                    width={128}
                                    alt="logo"
                                    src={item['wikiimage_url']}
                                />
                            }
                        >
                            <List.Item.Meta
                                title={item.name}
                                description={item.height}
                            />
                        </List.Item>
                    )}
                />
                <Button onClick={logout}>LogOut</Button>
            {/* </div> */}

            <div className="map">
                {activeMountain ?
                    <MapContainer ref={map} center={[activeMountain?.lat, activeMountain?.lon]} zoom={13} style={{ height: '500px', width: '100%' }}>
                        {/* <SetViewOnClick
                            coords={[activeMountain?.lat, activeMountain?.lon]}></SetViewOnClick> */}
                        <TileLayer
                            url="https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=8551b7e373d54e60b3083e3ade4386ff"
                            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            // url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            attribution='© OpenStreetMap-Mitwirkende, SRTM | Kartendarstellung: © OpenTopoMap (CC-BY-SA)'
                        />
                        {Object.values(routes).map((value, idx) => (
                            <div key={idx}>
                                {hoveredPosition && (
                                    <Popup position={hoveredPosition}>Difficulty  T{value.route.hike_difficulty}</Popup>)}
                                <MapWithPolyline
                                    key={idx}
                                    width={(hoveredRoute && hoveredRoute.route.id === value.route.id) ? 10 : 5}
                                    route={value}
                                    coordinates={value.waypoints} color="blue" />
                            </div>
                        ))}

                    </MapContainer> : "Chose a mountain"}
                <div>
                    {hoveredRoute && hoveredRoute.route.name}
                    {hoveredRoute && " |  T" + hoveredRoute.route.hike_difficulty}
                    {hoveredRoute && "|   UIAA: " + hoveredRoute.route.uiaa_difficulty}
                    {hoveredRoute && "|   Length: " + hoveredRoute.route.length + "m"}
                </div>
            </div>
        </div>
    )

}